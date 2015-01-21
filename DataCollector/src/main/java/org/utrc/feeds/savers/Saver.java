package org.utrc.feeds.savers;

import com.mongodb.DBObject;

public interface Saver {
    boolean save(DBObject object);
    String getCollectionName();
}
