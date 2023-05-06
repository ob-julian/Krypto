import random
from plot import plot


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


if __name__ == '__ain__':
    data = []
    for i in range(1, 365):
        print(i)
        data.append([i, birthday_paradox_same_day(i, 10000) *100, birthday_paradox_set_day(i, 10000, 1)* 100])
    plot(data)

print(birthday_paradox_set_day(253, 10000, 50))