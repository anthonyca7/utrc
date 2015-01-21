package org.utrc.feeds.savers;

import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import java.util.Map;


public class UniqueSaver implements Saver {
    private DBCollection collection;

    public UniqueSaver(DBCollection collection) {
        
        this.collection = collection;
    }

    @Override
    public boolean save(DBObject object) {
        long foundFeeds = collection.count(object);
//        DBObject obj = collection.findOne(object);

        if (foundFeeds == 0) {
//            System.out.println(obj);
//            System.out.println(object.toString());
            collection.insert(object);
            return true;
        }


        return false;
    }

    public String getCollectionName() {
        return collection.getName();
    }
}
