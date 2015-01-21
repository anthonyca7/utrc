package org.utrc.feeds.parsers;

import com.mongodb.util.JSON;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

public class XMLParser implements Parser{
    private String[] path;

    public XMLParser(String[] path) {
        this.path = path;
    }

    public XMLParser() {
        this(new String[]{});
    }

    @Override
    public Object parse(String data) {
        JSONObject json = XML.toJSONObject(data);
        if (json == null) return null;

        else {
            for (String key : getPath()) {
                if (json.has(key)) {
                    if (json.get(key) instanceof JSONArray) {
                        return JSON.parse(json.get(key).toString());
                    }
                    else {
                        json = (JSONObject) json.get(key);
                    }
                }
                else {
                    throw new RuntimeException("Invalid Path");
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
