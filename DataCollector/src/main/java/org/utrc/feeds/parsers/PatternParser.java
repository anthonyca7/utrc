package org.utrc.feeds.parsers;

import com.mongodb.util.JSON;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PatternParser implements Parser {
    private static final String doublePattern = "[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?";
    private static final String intPattern = "[-+]?[0-9]*";

    private Pattern pattern;
    private int cols;

    public PatternParser(Pattern pattern, int cols) {
        this.pattern = pattern;
        this.cols = cols;
    }

    @Override
    public Object parse(String response) {
        Matcher matcher = pattern.matcher(response);
        ArrayList<String> data = new ArrayList<String>();

        while (matcher.find()) {
            data.add(matcher.group());
        }

        int size = data.size();
        int feedCount = size / cols;
        StringBuilder feeds = new StringBuilder();
        feeds.append("[");

        for (int i = 1; i < feedCount; i++) {
            StringBuilder feed = new StringBuilder("{");
            for (int j = 0; j < cols; j++) {
                String key = data.get(j).replaceAll("\"", "'");

                if (data.get(cols * i + j).replaceAll("\"", "").matches(doublePattern)) {
                    double value = Double.parseDouble(data.get(cols * i + j).replaceAll("\"", ""));
                    feed.append(key + ":" + value +
                            ((j + 1 == cols) ? "" : ", "));
                } else if (data.get(cols * i + j).replaceAll("\"", "").matches(intPattern)) {
                    int value = Integer.parseInt(data.get(cols * i + j).replaceAll("\"", ""));
                    feed.append(key + ":" + value +
                            ((j + 1 == cols) ? "" : ", "));
                } else {
                    feed.append(key + ":" + data.get(cols * i + j).replaceAll("\"", "'") +
                            ((j + 1 == cols) ? "" : ", "));
                }
            }


            feed.append("}");
            if (i != feedCount-1)
                feed.append(", ");

            feeds.append(feed.toString());
        }

        feeds.append("]");
        return JSON.parse(feeds.toString());
    }

    @Override
    public void setPath(Object path) {

    }
}
