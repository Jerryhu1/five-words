package timer

import (
	"fmt"
	"time"
)

type Timer struct {
}

func (t *Timer) StartTimer(duration time.Duration, callback func()) error {
	ticker := time.NewTicker(time.Second)
	done := make(chan bool)
	go func() {
		for {
			select {
			case <-done:
				return
			case <-ticker.C:
				callback()
			}
		}
	}()

	time.Sleep(duration)
	ticker.Stop()
	done <- true

	return nil
}

func (t Timer) runTimer(roomName string, messageType int, resChan chan bool) {
	ticker := time.NewTicker(time.Second)
	done := make(chan bool)
	go func() {
		for {
			select {
			case <-done:
				return
			case <-ticker.C:
				newState, err := t.roomSrv.DecrementTimer(roomName)
				if err != nil {
					done <- true
					fmt.Println(err)
					return
				}

				err = t.broadcaster.BroadcastMessage(newState, messageType)
				if err != nil {
					fmt.Println(err)
					return
				}

				if newState.Timer == 0 {
					done <- true
				}
			}
		}
	}()

	<-done
	ticker.Stop()
	resChan <- true
}
