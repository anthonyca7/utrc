package org.feeds;

import com.mongodb.DBCollection;

import javax.swing.text.DateFormatter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

public class NYSDOTFeed extends LoginFeed {
    private static final String url = "https://165.193.215.51/XMLFeeds/createXML.aspx";
    private static final String dateTimeRegEx = "^(\\d{1,2})[/](\\d{1,2})[/](\\d{2,4})\\s(\\d{1,2}):(\\d{2}):(\\d{2})\\s(AM|PM)$";
    private static final String dateRegEx = "^(\\d{1,2})[/](\\d{1,2})[/](\\d{2,4})$";
    private static final HashMap<String, DateFormat> dateMap = new HashMap<String, DateFormat>();

    static {
        DateFormat dateTimeFormatter = new SimpleDateFormat("M/d/y h:m:s a");
        DateFormat dateFormatter = new SimpleDateFormat("M/d/y");

        dateMap.put(dateTimeRegEx, dateTimeFormatter);
        dateMap.put(dateRegEx, dateFormatter);
    }

    public NYSDOTFeed(DBCollection collection,
                      String[] path,
                      String[][] datePaths,
                      int interval,
                      HashMap<String, String> postData) {

        super(url, collection, path, null, dateMap, datePaths, interval, postData);
    }
}
