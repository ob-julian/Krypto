import math
import math
import matplotlib.pyplot as plt
import random

def is_prime(n, k=5):
    if n < 2:
        return False
    if n == 2 or n == 3:
        return True
    if n % 2 == 0:
        return False

    # Write n-1 as 2^r * d
    r = 0
    d = n - 1
    while d % 2 == 0:
        r += 1
        d //= 2

    # Perform k rounds of Miller-Rabin primality test
    for i in range(k):
        a = random.randint(2, n-2)
        x = pow(a, d, n)
        if x == 1 or x == n-1:
            continue
        for j in range(r-1):
            x = pow(x, 2, n)
            if x == n-1:
                break
        else:
            return False
    return True


def real_log(x, base):
    # Solve for y in base^y = x
    return math.log(x, base)

def discrete_log(g, h, p, check = True):
    # Solve for x in g^x = h (mod p)
    # Note: p must be prime
    if check:
        if not is_prime(p):
            raise ValueError('Modulus must be prime')
    m = int(math.ceil(math.sqrt(p - 1)))
    table = {}
    for j in range(m):
        table[pow(g, j, p)] = j
    gm = pow(g, m*(p-2), p)
    for i in range(m):
        y = (h * pow(gm, i, p)) % p
        if y in table:
            return i*m + table[y]
    return None

def plot_logs(start, end, base, mod):
    if not is_prime(mod):
        raise ValueError('Modulus must be prime')
    x_vals = []
    dlog_vals = []
    rlog_vals = []
    for x in range(start, end+1):
        x_vals.append(x)
        dlog = discrete_log(base, x, mod, False)
        dlog_vals.append(dlog)
        rlog = real_log(x, base)
        rlog_vals.append(rlog)

    fig, ax1 = plt.subplots()

    color = 'tab:orange'
    ax1.set_xlabel('x')
    ax1.set_ylabel('Discrete Logarithm', color=color)
    ax1.plot(x_vals, dlog_vals, color=color)
    ax1.tick_params(axis='y', labelcolor=color)

    ax2 = ax1.twinx()

    color = 'tab:blue'
    ax2.set_ylabel('Real Logarithm', color=color)
    ax2.plot(x_vals, rlog_vals, color=color)
    ax2.tick_params(axis='y', labelcolor=color)

    plt.title(f'Discrete and Real Logarithms (base {base}, mod {mod})')
    fig.tight_layout()
    plt.show()

if __name__ == '__main__':
    plot_logs(1, 223*2, 73, 223)