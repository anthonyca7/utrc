package org.feeds;

/**
 * Created by anthony on 10/2/14.
 */
public abstract class Task implements Runnable{
    abstract void getData();
    abstract int getDuration();

    @Override
    public abstract void run();
}
