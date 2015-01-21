package org.utrc.tasks;

import org.utrc.feeds.Feed;

public class IndividualTask extends Task implements Runnable {
    private final Feed feed;
    private final int interval;

    public IndividualTask(Feed feed, int interval)
    {
        this.feed = feed;
        this.interval = interval;
    }

    @Override
    public int getDuration()
    {
        return getInterval();
    }

    @Override
    public void getData() {
        try {
            getFeed().update();
        }
        catch (Exception ex) {
            System.out.println("Exception: " + ex);
            ex.printStackTrace();
        }
    }

    @Override
    public void run() {
        this.getData();
    }

    public Feed getFeed() {
        return feed;
    }

    public int getInterval() {
        return interval;
    }
}