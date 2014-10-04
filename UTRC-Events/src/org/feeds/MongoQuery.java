package org.feeds;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import org.json.JSONObject;

public class MongoQuery
{
    private String[][] paths;
    public DBCollection collection;


    public MongoQuery(String[][] paths, DBCollection collection)
    {
        this.paths = paths;
        this.collection = collection;

        if (paths.length < 1) throw new RuntimeException("This class needs more than one path");
    }

    public boolean isUnique(JSONObject data)
    {
        BasicDBObject query = new BasicDBObject();

        if (collection == null) throw new RuntimeException("Collection must be set first");


        for (String[] path : paths)
        {
            if (path.length == 1) query.append(path[0], data.get(path[0]));
            else query.append(path[0], createSearchObject(path, 1, path.length, data));
        }

        DBCursor result = collection.find(query);

        return !result.hasNext();
    }

    private DBObject createSearchObject(String[] path, int start, int end, JSONObject data)
    {
        if (!data.has(path[start]))
        {
            throw new RuntimeException("Wrong path given to uniqueKey Object");
        }
        if (start == end-1)
        {
            return new BasicDBObject(path[start], data.get(path[start]));
        }

        return new BasicDBObject(path[start], createSearchObject(path, start+1, end, (JSONObject) data.get(path[start])));
    }

    public boolean hasPath() {
        if (paths[0].length != 0) return true;
        else return false;
    }
}
