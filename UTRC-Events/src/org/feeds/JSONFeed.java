package org.feeds;

import com.mongodb.BasicDBList;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

import java.text.DateFormat;
import java.util.Map;

/**
 * Created by anthony on 1/13/15.
 */
public class JSONFeed extends BasicFeed {
    public JSONFeed(String url, DBCollection collection, String[] path, MongoQuery query, Map<String, DateFormat> dateMap, String[][] datePaths, int interval) {
        super(url, collection, path, query, dateMap, datePaths, interval);
    }



    protected BasicDBList getDBList() {
        connect();
        String response = getResponse();
        return (BasicDBList) JSON.parse(response);
    }

    @Override
    public void getData()
    {
        int inserted = 0;
        DBCollection collection = getCollection();
        BasicDBList dataList = getDBList();
        int size = dataList.size();

        System.out.println(size + " found!!!!!!!!!!!!!1");

        if (!dataList.isEmpty()) {
            for (int i = 0; i < size; i++) {
                // System.out.println(i + " " + data.length());
                DBObject object = extractDates((DBObject) dataList.get(i));

                if (object == null) continue;

                DBCursor foundFeeds = collection.find(object);

                if (!foundFeeds.hasNext()) {
                    collection.insert(object);
                    inserted++;
                }

            }
            getInsertionMessage(inserted, size, collection.getName(), getUrl());
        }
        else {
            throw new RuntimeException("PATH DOES NOT CONTAIN THE DATA");
        }
    }


//        JSONObject res = XML.toJSONObject(response);
//        JSONArray data;



//        if (res == null) return null;

//        for (String key : path) {
//            if (res.has(key)) {
//                if (res.get(key) instanceof JSONArray) {
//                    data = (JSONArray) res.get(key);
//                    return data;
//                } else {
//                    res = (JSONObject) res.get(key);
//                }
//            } else {
//                throw new RuntimeException("Invalid Path");
//            }
//        }

//        throw new RuntimeException("Invalid Path");
//    }
}
