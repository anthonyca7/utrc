package org.utrc.feeds.collectors;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class BasicCollector implements Collector {
    private String url;

    public BasicCollector(String url) {
        this.url = url;
    }

    @Override
    public String getData() throws Exception {
        URL uri = new URL(getURL());
        HttpURLConnection connection = (HttpURLConnection) uri.openConnection();
        connection.setRequestMethod("GET");
        String USER_AGENT = "Mozilla/5.0";
        connection.setRequestProperty("User-Agent", USER_AGENT);

        if (connection.getResponseCode() == 200) {
            BufferedReader in = new BufferedReader(
                    new InputStreamReader(connection.getInputStream()));

            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            return response.toString();
        }
        else {
            throw new RuntimeException("Did not get a 200 response instead got " + connection.getResponseCode());
        }
    }

    public String getURL() {
        return url;
    }
}
