package org.feeds;

public abstract class Feed {
    private String url;
    private int interval;
    private String response;

    protected Feed(String url, int interval) {
        this.url = url;
        this.interval = interval;
    }


    abstract void connect();
    abstract void getData();


    public String getUrl() {
        return url;
    }

    public int getInterval() {
        return interval;
    }

    public String getResponse() {
        return response;
    }

    protected void setUrl(String url) {
        this.url = url;
    }

    protected void setInterval(int interval) {
        this.interval = interval;
    }

    protected void setResponse(String response) {
        this.response = response;
    }
}
