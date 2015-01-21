package org.utrc.feeds.extractors;

import com.joestelmach.natty.DateGroup;
import com.joestelmach.natty.Parser;
import com.mongodb.DBObject;

import java.util.Date;
import java.util.List;

public class DateExtractor implements Extractor{
    private final String[][] dateLocations;

    public DateExtractor(String[][] dateLocations) {
        this.dateLocations = dateLocations;
    }

    @Override
    public DBObject extract(DBObject object) {
        if (dateLocations != null && object != null) {

            for (String[] dateLocation : dateLocations) {
                DBObject cursor = object;
                for (String path : dateLocation) {
                    if (cursor.containsField(path)) {
                        Object obj = cursor.get(path);

                        if (obj instanceof DBObject) {
                            cursor = (DBObject) cursor.get(path);
                        }
                        else if (obj instanceof String) {
                            String dateString = (String) obj;

                            if (!dateString.isEmpty()) {
                                Parser parser = new Parser();
                                List groups = parser.parse(dateString);

                                if (groups.size() == 1) {
                                    List dates = ((DateGroup) groups.get(0)).getDates();

                                    if (dates.size() == 1) {
                                        cursor.removeField(path);
                                        cursor.put(path, (Date) dates.get(0));
                                    } else {
                                        System.out.println("More than one Date found " + dates.toString());
                                        return null;
                                    }
                                } else {
                                    System.out.println("DateString: " + dateString + " had " + groups.size() + " dates");
                                    return null;
                                }
                            }
                            break;
                        }
                        else {
                            System.out.println("Object in Date Extractor had invalid type");
                            return null;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
        }
        return object;
    }

}