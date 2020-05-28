using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Interfaces;

namespace WebApplication.Services
{
    public class JaroWinklerWordComparisonService : IWordComparisonService
    {
        #region Private Constants

        private const double mWeightThreshold = 0.7;
        private const int mNumChars = 4;

        private const double minValue = 0.85;

        #endregion

        #region IWordComparisonService implementation

        /// <summary>
        /// Compare 2 strings.
        /// This method uses Jaro-Winkler distance.
        /// </summary>
        /// <param name="first">First string</param>
        /// <param name="second">Second string</param>
        /// <returns></returns>
        public double Compare(string first, string second)
        {
            var value = Proximity(first, second);
            return value;
        }

        /// <summary>
        /// Checks whether the coefficient satisfies the condition.
        /// </summary>
        /// <param name="value">Value of Jaro-Winkler distance</param>
        /// <returns></returns>
        public bool IsSatisfy(double value)
        {
            return value >= minValue;
        }

        #endregion

        #region Private Members

        /// <summary>
        /// Returns the Jaro-Winkler distance between the specified  
        /// strings. The distance is symmetric and will fall in the 
        /// range 0 (no match) to 1 (perfect match). 
        /// </summary>
        /// <param name="aString1">First String</param>
        /// <param name="aString2">Second String</param>
        /// <returns></returns>
        private double Proximity(string aString1, string aString2)
        {
            int lLen1 = aString1.Length;
            int lLen2 = aString2.Length;

            if (lLen1 == 0)
                return lLen2 == 0 ? 1.0 : 0.0;

            int lSearchRange = Math.Max(0, Math.Max(lLen1, lLen2) / 2 - 1);

            bool[] lMatched1 = new bool[lLen1];
            bool[] lMatched2 = new bool[lLen2];

            int lNumCommon = 0;
            for (int i = 0; i < lLen1; ++i)
            {
                int lStart = Math.Max(0, i - lSearchRange);
                int lEnd = Math.Min(i + lSearchRange + 1, lLen2);

                for (int j = lStart; j < lEnd; ++j)
                {
                    if (lMatched2[j])
                        continue;

                    if (aString1[i] != aString2[j])
                        continue;

                    lMatched1[i] = true;
                    lMatched2[j] = true;
                    ++lNumCommon;
                    break;
                }
            }

            if (lNumCommon == 0) 
                return 0.0;

            int lNumHalfTransposed = 0;
            int k = 0;

            for (int i = 0; i < lLen1; ++i)
            {
                if (!lMatched1[i]) 
                    continue;

                while (!lMatched2[k]) 
                    ++k;

                if (aString1[i] != aString2[k])
                    ++lNumHalfTransposed;

                ++k;
            }

            int lNumTransposed = lNumHalfTransposed / 2;
            double lNumCommonD = lNumCommon;
            double lWeight = (lNumCommonD / lLen1
                + lNumCommonD / lLen2
                + (lNumCommon - lNumTransposed) / lNumCommonD) / 3.0;

            if (lWeight <= mWeightThreshold) 
                return lWeight;

            int lMax = Math.Min(mNumChars, Math.Min(aString1.Length, aString2.Length));
            int lPos = 0;

            while (lPos < lMax && aString1[lPos] == aString2[lPos])
                ++lPos;

            if (lPos == 0) 
                return lWeight;

            return lWeight + 0.1 * lPos * (1.0 - lWeight);
        }

        #endregion
    }
}
