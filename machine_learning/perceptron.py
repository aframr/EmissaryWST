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
        Problem 3.1
        Returns training and test errors for each perceptron type for an input
        number of passes, classifying between the given pos and neg labels.
        """
        p = Perceptron(TRAINING_FILE, pos_label, [neg_label])
        for i in range(num_passes):
            print "==================================="
            print "Pass %d" % (i + 1)
            print "==================================="

            p.train()
            # problem 1
            for p_type in range(len(P_TYPES)):
                print "%s Perceptron:" % P_TYPES_STR[p_type]
                for f in [TRAINING_FILE, TEST_FILE]:
                    e = p.error(f, p_type)
                    print "%s error: %f" % (f, e)
                print

    @staticmethod
    def binary_classifiers_k_strongest(pos_label, neg_labels, num_passes, k):
        """
        Problem 3.2
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

    @staticmethod
    def build_confusion_matrix():
        """
        Problem 3.3
        Builds transposed confusion matrix, with true class label as row and
        predicted class label as column. 
        """
        # get number of data points for each label
        data = numpy.loadtxt(TEST_FILE, dtype=int) 
        label_dict = {}
        for label in [d[-1] for d in data]:
            if label not in label_dict:
                label_dict[label] = 1
            else:
                label_dict[label] = label_dict[label] + 1

        # all_labels used to construct "all"/neg labels
        all_labels = [key for key in label_dict]
        # build k classifiers
        print "Building classifiers:\n"
        perceptrons = {}
        for label in all_labels:
            print "Building classifier %d vs all" % label
            neg_labels = all_labels[:]
            neg_labels.remove(label)
            p = Perceptron(TRAINING_FILE, label, neg_labels)
            p.train()
            perceptrons[label] = p

        print "Building confusion matrix..."
        # build confusion matrix (transposed for faster scalar multiplication)
        confusion_matrix = numpy.zeros((len(all_labels), len(all_labels) + 1))

        for d in data:
            x, label = d[:-1], d[-1]
            
            classified = []
            for perceptron_label in perceptrons:
                perceptron = perceptrons[perceptron_label]
                prediction_sign = perceptron.predict(numpy.array(x), GEN)

                # randomize
                if prediction_sign == 0:
                    prediction_sign = 1 if (random.random() > 0.5) else -1

                if prediction_sign == 1:
                    classified.append(perceptron_label)

            # see how many classifiers believed x in C_i
            if len(classified) == 1:
                confusion_matrix[label - 1][classified[0] - 1] += 1
            else:
                # don't know 
                confusion_matrix[label - 1][len(all_labels)] += 1

        # divide prediction rows by total label count
        for label in label_dict:
            confusion_matrix[label - 1] /= float(label_dict[label])

        print "Confusion matrix: "
        print str(numpy.transpose(confusion_matrix))


def main():
    print "Initializing perceptron..."
    # problem 3.1
    Perceptron.binary_classifiers(1, 2, 3)

    # problem 3.2
    Perceptron.binary_classifiers_k_strongest(1, [2], 3, 3)

    # problem 3.3
    #Perceptron.build_confusion_matrix()

if __name__ == "__main__":
    main()

