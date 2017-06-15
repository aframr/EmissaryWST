#!/usr/bin/env python
import numpy
import time
import random
import heapq
import sets

TRAINING_FILE   = "train.txt"
TEST_FILE       = "test.txt"
DICTIONARY_FILE = "dict.txt"

# Misc. Flags
DEBUG = False
GEN = 0
VOTE = 1
AVG = 2
P_TYPES = [0, 1, 2]
P_TYPES_STR = ["General", "Voted", "Average"]

def debug(msg):
    if DEBUG:
        print msg

class Perceptron(object):

    def __init__(self, train_file, pos_label, neg_labels):
        self.data = numpy.loadtxt(train_file, dtype=int)
        # w is list of w's
        # initialize w[0] to 0 vector
        self.w = [numpy.zeros(len(self.data[0]) - 1)]
        self.c = [1]
        self.m = 0
        # pos_label will be (+1)
        self.pos_label = pos_label
        # neg_label(s) will be (-1)
        # if binary classifier, just use neg_labels[0]
        self.neg_labels = neg_labels

    def train(self):
        """
        Runs the perceptron training algorithm, usable for General, Voted, 
        and Average perceptron predictions
        """
        for d in self.data:
            x = d[:-1]
            y = d[-1]

            # sign is y_t. map pos/neg label(s) to +1/-1
            sign = None
            if y == self.pos_label:
                sign = 1
            elif y in self.neg_labels:
                # multiple neg labels for 1 vs all classifier
                sign = -1
            else: 
                # label not of concern
                continue

            # update rule: if y<w,x> <= 0:
            if (sign * numpy.dot(self.w[self.m], x)) <= 0:
                # w_{m+1} = w_m + y*x
                self.w.append(numpy.add(self.w[self.m], sign * x))
                self.c.append(1)

                debug("w[m]")
                debug(str(self.w[self.m]))
                debug("sign * x")
                debug(str(sign * x))

                self.m += 1

                debug("w[m+1]")
                debug(str(self.w[self.m]))

            else:
                self.c[self.m] += 1
        print "Trained through %d data points" % len(self.data)

    def predict(self, x, perceptron_type):
        """
        Returns the sign of a prediction (+1 or -1)
        """
        if perceptron_type == GEN:
            # y = sign(<w,m>)
            return numpy.sign(numpy.dot(self.w[self.m], x))
        elif perceptron_type == VOTE:
            s = 0
            for i in range(len(self.w)):
                s += self.c[i] * numpy.sign(numpy.dot(self.w[i], x))
            return numpy.sign(s)
        elif perceptron_type == AVG:
            s = numpy.zeros(len(self.w[0]))
            for i in range(len(self.w)):
                s = numpy.add(s, self.c[i] * self.w[i])
            return numpy.sign(numpy.dot(s, x))
        else:
            print "Invalid perceptron_type"

    def error(self, filename, perceptron_type):
        """
        Determine the error using data loaded from the file.
        """
        incorrect = 0
        data = numpy.loadtxt(filename)
        num_points = 0
        for d in data:
            x, label = d[:-1], d[-1]

            if not (label == self.pos_label or label in self.neg_labels):
                # data not in subset of binary classifier
                continue

            # increment the number of points we looked at
            num_points += 1

            prediction_sign = self.predict(numpy.array(x), perceptron_type)
            if prediction_sign == 0:
                prediction_sign = 1 if (random.random() > 0.5) else -1

            if prediction_sign == 1:
                if label != self.pos_label:
                    incorrect += 1
            else:
                if label not in self.neg_labels:
                    incorrect += 1

        return float(incorrect) / float(num_points)

    @staticmethod
    def binary_classifiers(pos_label, neg_label, num_passes):
        """
        Returns training and test errors for each perceptron type for an input
        number of passes, classifying between the given pos and neg labels.
        """
        p = Perceptron(TRAINING_FILE, pos_label, [neg_label])
        for i in range(num_passes):
            print "==================================="
            print "Pass %d" % (i + 1)
            print "==================================="

            p.train()
            for p_type in range(len(P_TYPES)):
                print "%s Perceptron:" % P_TYPES_STR[p_type]
                for f in [TRAINING_FILE, TEST_FILE]:
                    e = p.error(f, p_type)
                    print "%s error: %f" % (f, e)
                print

    @staticmethod
    def binary_classifiers_k_strongest(pos_label, neg_labels, num_passes, k):
        """
        Prints the words associated with the k most representative of the pos and neg
        label respectively (most positive and most negative dot product values)
        """
        # train up to num_passes
        print "Re-training perceptron: Please wait... "
        p = Perceptron(TRAINING_FILE, pos_label, neg_labels)
        for i in range(num_passes):
            print "Running Pass %d... " % (i + 1)
            p.train()
        print "\nDone training\n"
            
        # average perceptron w
        w = numpy.zeros(len(p.w[0]))
        for i in range(len(p.w)):
            w = numpy.add(w, p.c[i] * p.w[i])

        # find most positive and negative points
        elements = []
        index = 0
        for xi in w:
            elements.append( (xi, index) )
            index += 1

        heapq.heapify(elements)

        largest = heapq.nlargest(k, elements)
        smallest = heapq.nsmallest(k, elements)

        dictionary = numpy.loadtxt(DICTIONARY_FILE, dtype=str)

        print str(k) + " Highest coordinates for outcome [Show]..."
        for l in largest:
            print l,
            print dictionary[l[1]]

        print str(k) + " Highest coordinates for outcome [No Show]..."
        for s in smallest:
            print s,
            print dictionary[s[1]]

def main():
    print "Initializing perceptron..."
    # use this for testing your perceptron
    Perceptron.binary_classifiers(1, 2, 3)

    # use this to find associations with appointment absence
    Perceptron.binary_classifiers_k_strongest(1, [2], 3, 3)


if __name__ == "__main__":
    main()

