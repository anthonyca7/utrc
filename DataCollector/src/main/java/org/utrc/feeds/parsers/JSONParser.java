package org.utrc.feeds.parsers;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;

public class JSONParser implements Parser {
    private String[] path;

    public JSONParser(String[] path) {
        this.path = path;
    }

    public JSONParser() {
        this(null);
    }

    @Override
    public Object parse(String data) {
        DBObject json = (DBObject) JSON.parse(data);

        if (json == null) {
            throw new RuntimeException("Response was empty");
        }
        else if (json instanceof BasicDBList) {
            return json;
        }
        else if (json instanceof BasicDBObject) {
            if (path != null) {
                for (String s : path) {
                    BasicDBObject dbObject = (BasicDBObject) json;

                    if (dbObject.containsField(s)) {
                        json = (DBObject) dbObject.get(s);

                        if (json instanceof BasicDBList) {
                            return json;
                        }
                    }
                }
            }
        }

        throw new RuntimeException("Invalid Path");
    }

    public String[] getPath() {
        return path;
    }

    public void setPath(Object path) {
        if (path instanceof String[])
            this.path = (String[]) path;
        else
            throw new RuntimeException("Wrong path");
    }
}
