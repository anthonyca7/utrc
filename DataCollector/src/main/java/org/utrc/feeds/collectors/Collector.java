package org.utrc.feeds.collectors;

public interface Collector{
    String getData() throws Exception;
    String getURL();
}
