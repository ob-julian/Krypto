import random
from plot import plot_absolute
import time


def birthday_paradox_same_day(num_people, num_trials):
    num_matches = 0
    for i in range(num_trials):
        birthdays = []
        for j in range(num_people):
            birthday = random.randint(1, 365)
            birthdays.append(birthday)
        if len(birthdays) != len(set(birthdays)):
            num_matches += 1
    return num_matches

def birthday_paradox_set_day(num_people, num_trials, day):
    num_matches = 0
    for i in range(num_trials):
        birthdays = []
        for j in range(num_people):
            birthday = random.randint(1, 365)
            birthdays.append(birthday)
        if day in birthdays:
            num_matches += 1
    return num_matches


if __name__ == '__main__':
    data = []
    # initialize data
    for i in range(1, 365):
        data.append([i, 0, 0])
    run = 1
    try:
        while True:
            print(f'\r  Simulations: {run}', end='')
            for i in range(1, 365):
                data[i-1][1] += birthday_paradox_same_day(i, 1)
                data[i-1][2] += birthday_paradox_set_day(i, 1, 1)
            plot_absolute(data, run)
            run += 1
    except KeyboardInterrupt:
        print("\nSimulation stopped")