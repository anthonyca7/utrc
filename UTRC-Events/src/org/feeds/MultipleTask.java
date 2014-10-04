package org.feeds;

/**
 * Created by anthony on 10/2/14.
 */
public class MultipleTask extends Task implements Runnable{
    private final Feed[] feeds;
    private final int duration;
    private final int sleepTime;


    public MultipleTask(Feed[] feeds, int duration, int sleepTime) {
        this.feeds = feeds;
        this.duration = duration;
        this.sleepTime = sleepTime;

        if (duration < 10) {
            throw new RuntimeException("Duration need to be greater than 10ms");
        }
    }

    @Override
    public void getData() {
        for (Feed feed : feeds) {
            try {
                Thread.sleep(duration);
                feed.getData();
            }
            catch (Exception ex){
                System.out.println("Exception from taskgroups: " + ex.toString());
            }
        }
    }

    @Override
    public int getDuration() {
        return duration;
    }

    @Override
    public void run() {
        this.getData();
    }
}
