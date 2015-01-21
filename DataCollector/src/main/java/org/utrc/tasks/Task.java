package org.utrc.tasks;

public abstract class Task implements Runnable {
    public abstract void getData();
    public abstract int getDuration();

    @Override
    public abstract void run();
}
