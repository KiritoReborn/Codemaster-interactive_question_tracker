import { Topic } from './types';

export const initialData: Topic[] = [
  {
    id: 'topic-basics',
    title: 'Learn the basics',
    isExpanded: true,
    subTopics: [
      {
        id: 'sub-things-to-know',
        title: 'Things to Know in C++/Java/Python or any language',
        questions: [
          {
            id: 'q-user-input',
            title: 'User Input / Output',
            url: 'https://www.geeksforgeeks.org/problems/search-query-auto-complete/1',
            difficulty: 'Hard',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Search Query Auto Complete'
          },
          {
            id: 'q-data-types',
            title: 'Data Types',
            url: 'https://www.geeksforgeeks.org/problems/data-type-1666706751/1',
            difficulty: 'Easy', // 'Basic' mapped to Easy
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Data Type'
          },
          {
            id: 'q-if-else',
            title: 'If Else statements',
            url: 'https://www.geeksforgeeks.org/problems/java-if-else-decision-making0924/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Decision Making in Java'
          },
          {
            id: 'q-switch',
            title: 'Switch Statement',
            url: 'https://www.geeksforgeeks.org/problems/java-switch-case-statement3529/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Java Switch Case statement'
          },
          {
            id: 'q-for-loops',
            title: 'For loops',
            url: 'https://www.naukri.com/code360/problems/nth-fibonacci-number_74156',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Nth Fibonacci Number'
          },
          {
            id: 'q-while-loops',
            title: 'While loops',
            url: 'https://www.geeksforgeeks.org/problems/while-loop-printtable-java/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: While loop- printTable - Java'
          },
          {
            id: 'q-functions',
            title: 'Functions (Pass by Reference and Value)',
            url: 'https://www.geeksforgeeks.org/problems/pass-by-reference-and-value/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Pass by Reference and Value'
          }
        ]
      },
      {
        id: 'sub-basic-maths',
        title: 'Know Basic Maths',
        questions: [
          {
            id: 'q-count-digits',
            title: 'Count Digits',
            url: 'https://www.geeksforgeeks.org/problems/count-digits5716/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-reverse-num',
            title: 'Reverse a Number',
            url: 'https://leetcode.com/problems/reverse-integer',
            difficulty: 'Medium',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Reverse Integer'
          },
          {
            id: 'q-palindrome',
            title: 'Check Palindrome',
            url: 'https://leetcode.com/problems/palindrome-number',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Palindrome Number'
          },
          {
            id: 'q-gcd',
            title: 'GCD Or HCF',
            url: 'https://www.geeksforgeeks.org/problems/lcm-and-gcd4516/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: LCM And GCD'
          },
          {
            id: 'q-armstrong',
            title: 'Armstrong Numbers',
            url: 'https://leetcode.com/problems/armstrong-number',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Armstrong Number'
          },
          {
            id: 'q-divisors',
            title: 'Print all Divisors',
            url: 'https://www.geeksforgeeks.org/problems/sum-of-all-divisors-from-1-to-n4738/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Sum 1 to n Divisors'
          },
          {
            id: 'q-prime',
            title: 'Check for Prime',
            url: 'https://www.geeksforgeeks.org/problems/minimum-number-of-jumps-1587115620/1',
            difficulty: 'Medium',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Minimum Jumps (Note: Dataset link mismatch, title says Prime)'
          }
        ]
      },
      {
        id: 'sub-recursion',
        title: 'Learn Basic Recursion',
        questions: [
          {
            id: 'q-print-1-n',
            title: 'Understand recursion by print something N times',
            url: 'https://www.geeksforgeeks.org/problems/print-1-to-n-without-using-loops-1587115620/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Print 1 To N Without Loop'
          },
          {
            id: 'q-print-name',
            title: 'Print name N times using recursion',
            url: 'https://www.geeksforgeeks.org/problems/print-gfg-n-times/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false,
            description: 'Practice problem: Print GFG n times'
          },
          {
            id: 'q-print-n-1',
            title: 'Print N to 1 using recursion',
            url: 'https://www.geeksforgeeks.org/problems/print-n-to-1-without-loop/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-sum-n',
            title: 'Sum of first N numbers',
            url: 'https://www.geeksforgeeks.org/problems/sum-of-first-n-terms5843/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-factorial',
            title: 'Factorial of N numbers',
            url: 'https://www.geeksforgeeks.org/problems/find-all-factorial-numbers-less-than-or-equal-to-n3548/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-valid-palindrome',
            title: 'Check if a string is palindrome or not',
            url: 'https://leetcode.com/problems/valid-palindrome',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-fibonacci',
            title: 'Fibonacci Number',
            url: 'https://leetcode.com/problems/fibonacci-number',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          }
        ]
      }
    ]
  },
  {
    id: 'topic-sorting',
    title: 'Learn Important Sorting Techniques',
    isExpanded: false,
    subTopics: [
      {
        id: 'sub-sorting-i',
        title: 'Sorting-I',
        questions: [
          {
            id: 'q-selection',
            title: 'Selection Sort',
            url: 'https://www.geeksforgeeks.org/problems/selection-sort/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-bubble',
            title: 'Bubble Sort',
            url: 'https://www.geeksforgeeks.org/problems/bubble-sort/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-insertion',
            title: 'Insertion Sort',
            url: 'https://www.geeksforgeeks.org/problems/insertion-sort/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          }
        ]
      },
      {
        id: 'sub-sorting-ii',
        title: 'Sorting-II',
        questions: [
          {
            id: 'q-merge',
            title: 'Merge Sort',
            url: 'https://www.geeksforgeeks.org/problems/merge-sort/1',
            difficulty: 'Medium',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-rec-bubble',
            title: 'Recursive Bubble Sort',
            url: 'https://www.geeksforgeeks.org/problems/bubble-sort/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-rec-insertion',
            title: 'Recursive Insertion Sort',
            url: 'https://www.geeksforgeeks.org/problems/insertion-sort/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-quick',
            title: 'Quick Sort',
            url: 'https://www.geeksforgeeks.org/problems/quick-sort/1',
            difficulty: 'Medium',
            status: 'Todo',
            isBookmarked: false
          }
        ]
      }
    ]
  },
  {
    id: 'topic-arrays',
    title: 'Solve Problems on Arrays [Easy -> Medium -> Hard]',
    isExpanded: false,
    subTopics: [
      {
        id: 'sub-arrays-easy',
        title: 'Easy',
        questions: [
          {
            id: 'q-largest',
            title: 'Largest Element in an Array',
            url: 'https://www.geeksforgeeks.org/problems/largest-element-in-array4009/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-second-largest',
            title: 'Second Largest Element in an Array without sorting',
            url: 'https://www.geeksforgeeks.org/problems/second-largest3735/1',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-sorted-rotated',
            title: 'Check if the array is sorted',
            url: 'https://leetcode.com/problems/check-if-array-is-sorted-and-rotated',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-remove-duplicates',
            title: 'Remove duplicates from Sorted array',
            url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-rotate-array',
            title: 'Left Rotate an array by one place',
            url: 'https://leetcode.com/problems/rotate-array',
            difficulty: 'Medium',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-rotate-d',
            title: 'Left rotate an array by D places',
            url: 'https://leetcode.com/problems/rotate-array',
            difficulty: 'Medium',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-move-zeroes',
            title: 'Move Zeros to end',
            url: 'https://leetcode.com/problems/move-zeroes',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-union',
            title: 'Find the Union',
            url: 'https://www.geeksforgeeks.org/problems/union-of-two-sorted-arrays-1587115621/1',
            difficulty: 'Medium',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-missing',
            title: 'Find missing number in an array',
            url: 'https://leetcode.com/problems/missing-number',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-consecutive-ones',
            title: 'Maximum Consecutive Ones',
            url: 'https://leetcode.com/problems/max-consecutive-ones',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-single-num',
            title: 'Find the number that appears once',
            url: 'https://leetcode.com/problems/single-number',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-longest-subarray-pos',
            title: 'Longest subarray with given sum K(positives)',
            url: 'https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1',
            difficulty: 'Medium',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-longest-subarray-neg',
            title: 'Longest subarray with sum K (Positives + Negatives)',
            url: 'https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1',
            difficulty: 'Medium',
            status: 'Todo',
            isBookmarked: false
          }
        ]
      },
      {
        id: 'sub-arrays-medium',
        title: 'Medium',
        questions: [
          {
            id: 'q-2sum',
            title: '2Sum Problem',
            url: 'https://leetcode.com/problems/two-sum',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-sort-colors',
            title: 'Sort an array of 0s 1s and 2s',
            url: 'https://leetcode.com/problems/sort-colors',
            difficulty: 'Medium',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-majority',
            title: 'Majority Element (>n/2 times)',
            url: 'https://leetcode.com/problems/majority-element',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-max-subarray',
            title: 'Kadanes Algorithm, maximum subarray sum',
            url: 'https://leetcode.com/problems/maximum-subarray',
            difficulty: 'Medium',
            status: 'Todo',
            isBookmarked: false
          },
          {
            id: 'q-stock',
            title: 'Stock Buy and Sell',
            url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock',
            difficulty: 'Easy',
            status: 'Todo',
            isBookmarked: false
          }
        ]
      }
    ]
  }
];