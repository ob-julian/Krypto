import random
from plot import plot
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
    probability = num_matches / num_trials
    return probability

def birthday_paradox_set_day(num_people, num_trials, day):
    num_matches = 0
    for i in range(num_trials):
        birthdays = []
        for j in range(num_people):
            birthday = random.randint(1, 365)
            birthdays.append(birthday)
        if day in birthdays:
            num_matches += 1
    probability = num_matches / num_trials
    return probability


if __name__ == '__main__':
    simulation_amount = 150
    data = []
    # to be fancy:
    bar_length = 50  # length of the progress bar in characters
    step_size = 365 / bar_length  # number of steps to take for each character of the bar
    for i in range(1, 365):
        progress = i / 365  # progress as a fraction
        filled_length = int(round(bar_length * progress))  # length of the filled portion of the bar
        remaining_length = bar_length - filled_length  # length of the unfilled portion of the bar
        filled_bar = '█' * filled_length  # character used to represent the filled portion of the bar
        empty_bar = '░' * remaining_length  # character used to represent the unfilled portion of the bar
        print(f'\r|{filled_bar}{empty_bar}| {i} / 365 ({progress:.1%})', end='')
        data.append([i, birthday_paradox_same_day(i, simulation_amount) *100, birthday_paradox_set_day(i, simulation_amount, 1)* 100])
    plot(data)
# else:
#    print(birthday_paradox_set_day(253, 10000, 50))