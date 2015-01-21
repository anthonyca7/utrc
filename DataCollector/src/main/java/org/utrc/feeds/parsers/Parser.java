package org.utrc.feeds.parsers;

public interface Parser {
    Object parse(String data);
    void setPath(Object path);
}
