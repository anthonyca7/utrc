package org.utrc.feeds;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;
import org.json.JSONArray;
import org.utrc.feeds.collectors.*;
import org.utrc.feeds.extractors.Extractor;
import org.utrc.feeds.parsers.Parser;
import org.utrc.feeds.savers.Saver;

public class MultiFeed implements Feed {
    private Collector collector;
    private Parser parser;
    private Saver[] savers;
    private Extractor[] extractors;
    private String[][] paths;
    private int numOfFeeds;

    public MultiFeed(Collector collector, Parser parser, Saver[] savers, Extractor[] extractors, String[][] paths) {
        this.collector = collector;
        this.parser = parser;
        this.savers = savers;
        this.extractors = extractors;
        this.paths = paths;

        this.numOfFeeds = paths.length;
    }

    public MultiFeed(Collector collector, Parser parser, Saver[] savers, String[][] paths) {
        this(collector, parser, savers, null, paths);
    }

    @Override
    public void update() {
        try {
            String data = collector.getData();

            for (int i = 0; i < numOfFeeds; i++) {
                String[] path = paths[i];
                Saver saver = savers[i];
                parser.setPath(path);

                Object json = parser.parse(data);

                if (json instanceof JSONArray) {
                    saveJSONArray((JSONArray) json, saver);
                }
                else if (json instanceof BasicDBList) {
                    saveDBList((BasicDBList) json, saver);
                }
                else {
                    System.out.println("Wrong format for the feeds : " + collector.getURL());
                }
            }

        }
        catch (Exception ex) {
            ex.printStackTrace();
            System.out.println("Error on multipath");
        }
    }

    private BasicDBList getFeed(BasicDBList feeds, String[] path) {
        DBObject feed = feeds;

        for (String key : path) {
            Object res = feed.get(key);

            if (res instanceof BasicDBList) {
                return (BasicDBList) res;
            }
            else if (res instanceof DBObject) {
                feed = (DBObject) res;
            }
            else {
                return null;
            }
        }

        return null;
    }

    private void saveDBList(BasicDBList feeds, Saver saver) {
        int inserted = 0;
        int size = feeds.size();

        for (int i = 0; i < size; i++) {
            DBObject feed = (DBObject) feeds.get(i);

            if (extractors != null) {
                for (Extractor extractor : extractors) {
                    feed = extractor.extract(feed);
                    if (feed == null) break;
                }
            }

            if (feed != null) {
                if(saver.save(feed)) {
                    inserted++;
                }
            }
        }

        getInsertionMessage(inserted, size, saver.getCollectionName(), collector.getURL());
    }

    private void saveJSONArray(JSONArray feeds, Saver saver) {
        BasicDBList dbList = (BasicDBList) JSON.parse(feeds.toString());
        saveDBList(dbList, saver);
    }

    private void getInsertionMessage(int inserted, int total, String collectionName, String url) {
        System.out.printf("%d out of %d data feeds inserted to %s from %s%n", inserted, total, collectionName, url);
    }
}
