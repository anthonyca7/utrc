package org.feeds;

import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class Feed
{
    private final String url;
    public final DBCollection collection;
    public final String[] path;
    public final MongoQuery query;

    public Feed(String url, DBCollection collection, String[] path, MongoQuery query)
    {
        this.url = url;
        this.collection = collection;
        this.path = path;
        this.query = query;
    }

    public void getData()
    {
        int inserted = 0;
        try
        {
            URL uri = new URL(this.url);
            HttpURLConnection connection =
                    (HttpURLConnection) uri.openConnection();

            connection.setRequestMethod("GET");
            String USER_AGENT = "Mozilla/5.0";
            connection.setRequestProperty("User-Agent", USER_AGENT);

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(connection.getInputStream()));

            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null)
            {
                response.append(inputLine);
            }
            in.close();

            JSONObject jsonResponse = XML.toJSONObject(response.toString());
            JSONArray data = null;

            for (String key : path)
            {
                if (jsonResponse.has(key))
                {
                    if (jsonResponse.get(key) instanceof JSONArray)
                    {
                        data = (JSONArray) jsonResponse.get(key);
                    }
                    else
                    {
                        jsonResponse = (JSONObject) jsonResponse.get(key);
                    }
                }
                else
                {
                    throw new RuntimeException("INVALID PATH");
                }
            }

            if (data != null)
            {
                for (int i = 0; i < data.length(); i++)
                {
                    JSONObject object = data.getJSONObject(i);

                    if (query.isUnique(object))
                    {
                        collection.insert((DBObject) JSON.parse(object.toString()));
                        inserted++;
                    }
                }
            }

            else
            {
                throw new RuntimeException("PATH DOES NOT CONTAIN THE DATA");
            }

            System.out.printf("%n%d out of %d data feeds inserted from %s", inserted, data.length(), url);
        }
        catch (Exception ex)
        {
            System.out.println("Error getting feed from " + url + ": " + ex.getMessage());
        }
    }
}
