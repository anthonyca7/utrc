package org.utrc.feeds.extractors;

import com.joestelmach.natty.DateGroup;
import com.joestelmach.natty.Parser;
import com.mongodb.DBObject;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class MMDDYYYYDateExtractor implements Extractor {
    private final String[][] dateLocations;

    public MMDDYYYYDateExtractor(String[][] dateLocations) {
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
                        } else if (obj instanceof String) {
                            String dateString = (String) obj;

                            if (!dateString.isEmpty() && !dateString.equals("01/01/0001 00:00:00")) {
//                                DateTimeFormatter fmt = DateTimeFormat.forPattern("dd/mm/yyyy hh:mm:ss");
//                                Date date = fmt.parseDateTime(dateString).toDate();

                                try {

                                    DateFormat dateFormat = new SimpleDateFormat("d/M/y h:m:s");
                                    Date date = dateFormat.parse(dateString);


                                    cursor.removeField(path);
                                    cursor.put(path, date);
                                }
                                catch (Exception ex) {
                                    return null;
                                }
                            }
                            break;
                        } else {
                            System.out.println("Object in Date Extractor had invalid type");
                            return null;
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        return object;
    }

}
