package org.feeds;

import com.mongodb.DBObject;
import com.mongodb.util.JSON;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;
import java.util.Set;

public abstract class Feed {
    private String url;
    private int interval;
    private String response;
    private final String[][] datePaths;
    private final Map<String, DateFormat> dateMap;

    protected Feed(String url, int interval, Map<String, DateFormat> dateMap, String[][] datePaths) {
        this.url = url;
        this.interval = interval;
        this.dateMap = dateMap;
        this.datePaths = datePaths;
    }

    abstract void connect();

    abstract void getData();

    protected DBObject extractDates(DBObject object) {
        if (datePaths.length < 1) {
            System.out.println("datepath was empty");
            return object;
        }

        for (String[] datePath : datePaths) {
            Object value = object;

            for (String key : datePath) {
                DBObject currentObject;

                if (value instanceof DBObject) {
                    currentObject = (DBObject) value;

                    if (currentObject.containsField(key)) {
                        value = currentObject.get(key);

                        if (value instanceof String) {
                            String dateString = (String) value;
                            if (dateString.isEmpty()) {
                                continue;
                            }

                            try {
                                Set<String> keys = dateMap.keySet();
                                boolean found = false;

                                for (String dateRegEx : keys) {
                                    if (dateString.matches(dateRegEx)) {
                                        DateFormat dateFormat = dateMap.get(dateRegEx);
                                        Date date = dateFormat.parse(dateString);

                                        currentObject.removeField(key);
                                        currentObject.put(key, date);
//                                        System.out.println("key was " + value + " now " + date);

                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    System.out.println("No regex matches: " + dateString);
                                    System.exit(0);
                                }
                            }
                            catch (Exception ex) {
                                ex.printStackTrace();
                                System.exit(0);
                            }
                        }
                    }
                }
            }
        }

        return object;
    }

    protected DBObject extractDates(JSONObject jsonObject) {
        DBObject object = (DBObject) JSON.parse(jsonObject.toString());
        return this.extractDates(object);
    }

    public String[][] getDatePaths() {
        return datePaths;
    }

    public Map<String, DateFormat> getDateMap() {
        return dateMap;
    }

    public String getUrl() {
        return url;
    }

    public int getInterval() {
        return interval;
    }

    public String getResponse() {
        return response;
    }

    protected void setUrl(String url) {
        this.url = url;
    }

    protected void setInterval(int interval) {
        this.interval = interval;
    }

    protected void setResponse(String response) {
        this.response = response;
    }
}
