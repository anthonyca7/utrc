package org.utrc.feeds.extractors;

import com.mongodb.DBObject;

public interface Extractor {
    DBObject extract(DBObject object);
}
