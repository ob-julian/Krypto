import matplotlib.pyplot as plt
import time

def create_data():
    data = []
    tmp1 = 1
    tmp2 = 1
    for i in range(1, 365):
        tmp1 = tmp1 * ((365-(i-1))/365)
        tmp2 = tmp2 * (364 / 365)
        data.append([i, (1-tmp1) *100, (1-tmp2) * 100])
    return data


def plot(data):
    
    # Extract the y-values and the x-values from each sublist in data
    y_values = [sublist[0] for sublist in data]
    x1_values = [sublist[1] for sublist in data]
    x2_values = [sublist[2] for sublist in data]
    create_plot(y_values, x1_values, x2_values)

def plot_absolute(data, amount):
    # No Block
    plt.ion()
    # Clear
    plt.clf()
    # Extract the y-values and the x-values from each sublist in data
    y_values = [sublist[0] for sublist in data]
    x1_values = [sublist[1]/amount for sublist in data]
    x2_values = [sublist[2]/amount for sublist in data]
    create_plot(y_values, x1_values, x2_values)
    plt.pause(0.001)


def create_plot(y_values, x1_values, x2_values):
    # Create a line plot for the first graph with x and y switched
    plt.plot(y_values, x1_values, marker='o', label='2 Personen mit gleichen Geburtstag')

    # Create a line plot for the second graph with x and y switched
    plt.plot(y_values, x2_values, marker='o', label='1 Persone mit vorgegebenen Geburtstag')

    # Set the x- and y-axis labels and the title of the plot with switched labels
    plt.ylabel('Wahrscheinlichkeit (in %)')
    plt.xlabel('Anzahl Personen')
    plt.title('Geburtstagsproblem')

    # Add a legend to the plot
    plt.legend()

    # Show the plot
    plt.show()



if __name__ == '__main__':
    data = create_data()
    plot(data)