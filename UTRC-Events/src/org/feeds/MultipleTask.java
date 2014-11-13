package org.feeds;

/**
 * Created by anthony on 10/2/14.
 */
public class MultipleTask extends Task implements Runnable {
    private final Feed[] feeds;
    private final int duration;
    private final int sleepTime;
    private final long[] lastExecuted;


    public MultipleTask(Feed[] feeds, int duration, int sleepTime) {
        this.feeds = feeds;
        this.duration = duration;
        this.sleepTime = sleepTime;

        lastExecuted = new long[feeds.length];

        for (int i = 0; i < feeds.length; i++) {
            lastExecuted[i] = System.currentTimeMillis() - feeds[i].getInterval()*1000;
        }

        if (duration < 10) {
            throw new RuntimeException("Duration need to be greater than 10ms");
        }
    }

    @Override
    public void getData() {
        for (int i = 0; i < feeds.length; i++) {
            Feed feed = feeds[i];

            if ( (long) feed.getInterval()*1000 <= System.currentTimeMillis() - lastExecuted[i]) {
                try {
                    lastExecuted[i] = System.currentTimeMillis();
                    Thread.sleep(duration);
                }
                catch (Exception ex){
                    System.out.println("Exception from taskgroups: " + ex);
                }
                feed.getData();
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
