package org.utrc.feeds.extractors;


import com.mongodb.DBObject;

public class InvalidCharExtractor implements Extractor {
    public InvalidCharExtractor() {

    }

    @Override
    public DBObject extract(DBObject object) {
        if (object.containsField("MapEncodedPolyline")) {
            object.removeField("MapEncodedPolyline");
        }

        return object;
    }
}
