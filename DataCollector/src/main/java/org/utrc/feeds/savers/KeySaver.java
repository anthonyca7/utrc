package org.utrc.feeds.savers;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

public class KeySaver implements Saver {
    private String[][] paths;
    private DBCollection collection;

    public KeySaver(DBCollection collection, String[][] paths) {
        this.collection = collection;
        this.paths = paths;
    }

    @Override
    public boolean save(DBObject object) {
        DBObject query = makeQuery(object);

        if (query != null) {
            long found = collection.count(query);

            if (found == 0) {
                collection.save(object);
                return true;
            }
        }

        return false;
    }

    public DBObject makeQuery(DBObject object) {
        BasicDBObject query = new BasicDBObject();

        for (String[] path : paths) {
            DBObject cursor = query;
            DBObject value = object;

            for (int j = 0; j < path.length; j++) {
                String key = path[j];

                if (j != path.length-1) {
                    if (value.containsField(key)) {
                        cursor.put(key, new BasicDBObject());
                        value = (DBObject) value.get(key);
                        cursor = (DBObject) cursor.get(key);
                    }
                    else {
                        System.out.println("Not found 1");
                        return null;
                    }
                }
                else {
                    if (value.containsField(key)){
                        Object data = value.get(key);

                        cursor.put(key, data);
                    }
                    else {
                        System.out.println("Not found 2");
                        return null;
                    }
                }
            }
        }

        return query;
    }

    @Override
    public String getCollectionName() {
        return collection.getName();
    }
}

