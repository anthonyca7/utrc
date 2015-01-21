package org.utrc.feeds;

import com.mongodb.BasicDBList;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;
import org.json.JSONArray;
import org.utrc.feeds.collectors.Collector;
import org.utrc.feeds.extractors.Extractor;
import org.utrc.feeds.parsers.Parser;
import org.utrc.feeds.savers.Saver;

public class BasicFeed implements Feed {
    private final Collector collector;
    private final Parser parser;
    private final Saver saver;
    private final Extractor[] extractors;

    public BasicFeed(Collector collector, Parser parser, Saver saver, Extractor[] extractors) {
        if (collector == null || saver == null || parser == null)
            throw new ExceptionInInitializerError("The collector, saver and parser cannot be null");

        this.collector = collector;
        this.parser = parser;
        this.saver = saver;
        this.extractors = extractors;
    }

    public BasicFeed(Collector collector, Parser parser, Saver saver) {
        this(collector, parser, saver, null);
    }

    @Override
    public void update() {
        try {
            String data = collector.getData();
            Object feedObject = parser.parse(data);

            if (feedObject == null) {
                System.out.println("Response could not be parse for " + saver.getCollectionName());
            }
            else if (feedObject instanceof JSONArray) {
                saveJSONArray((JSONArray) feedObject);
            }
            else if (feedObject instanceof BasicDBList) {
                saveDBList((BasicDBList) feedObject);
            }
            else {
                System.out.println("Feed Object has to be either a JSONArray or a BasicDBList");
            }
        }
        catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    private void saveDBList(BasicDBList feeds) {
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

    private void saveJSONArray(JSONArray feeds) {
        BasicDBList dbList = (BasicDBList) JSON.parse(feeds.toString());
        saveDBList(dbList);
    }

    private void getInsertionMessage(int inserted, int total, String collectionName, String url) {
        System.out.printf("%d out of %d data feeds inserted to %s from %s%n", inserted, total, collectionName, url);
    }
}
