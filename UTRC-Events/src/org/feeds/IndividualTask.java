package org.feeds;

public class IndividualTask extends Task implements Runnable {
    private final Feed feed;
    private static Integer sleepTime;

    public IndividualTask(Feed feed)
    {
        this.feed = feed;
    }

    public IndividualTask(Feed feed, Integer sleepTime) {
        this.feed = feed;
        this.sleepTime = sleepTime;
    }

    @Override
    public int getDuration()
    {
        return this.feed.getInterval();
    }

    @Override
    public void getData() {
        try {
            feed.getData();
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
}
