import { getRandomInt } from "@/lib/numbers"
import { states } from "./sampleData"

const sampleAnalytics = {
   //OVERVIEW PAGE
   branchLoginCount: {
      singleton: true,
      url: "Atms/BranchLoginCount",
      data: {
         "branchLoginDate": "2023-05-29T16:25:23.556Z",
         "formatedBranchLoginDate": "string",
         "totalBranches": 952,
         "noOfLoginBranches": 670,
         "noOfNotLoginBranches": 952 - 670
      }
   },
   terminalCountReport: {
      url: "Atms/TerminalCountReport",
      data: {
         "transactionDate": "2023-05-29T16:33:48.828Z",
         "formatedTransactionDate": "string",
         "totalTerminals": getRandomInt(3500, 6000),
         "totalTerminalJournalPosted": 600,
         "totalOnlineTerminals": 2200,
         "totalOfflineTerminals": 3500 - 2200
      }
   },
   terminalDarkImageCount: {
      url: "Atms/TerminalDarkImageCount",
      data: {
         "transactionDate": "2023-05-29T16:38:34.020Z",
         "formatedTransactionDate": "string",
         "totalImages": getRandomInt(2_525_000, 6_500_000),
         "totalOnlineTerminals": getRandomInt(2500, 10_800),
         "totalDarkImages": getRandomInt(4000, 8200)
      }
   },
   suspiciousTransactionsCount: {
      url: "Exceptions/SuspiciousTransactionsCount",
      data: {
         "transactionDate": "2023-05-29T16:45:55.424Z",
         "formatedTransactionDate": "string",
         "totalAttemptedTransactions": 54500
      }
   },
   performances: {
      singleton: true,
      url: "Graphs/AtmPerformance",
      data: {
         topPerformances: [
            {
               "terminalID": "17012488",
               "date": "2023-05-22T23:00:00Z",
               "metrics": 997
            },
            {
               "terminalID": "17016021",
               "date": "2023-05-22T23:00:00Z",
               "metrics": 915
            },
            {
               "terminalID": "17015203",
               "date": "2023-05-22T23:00:00Z",
               "metrics": 865
            },
            {
               "terminalID": "17015252",
               "date": "2023-05-22T23:00:00Z",
               "metrics": 860
            },
            {
               "terminalID": "17014803",
               "date": "2023-05-22T23:00:00Z",
               "metrics": 851,
            }
         ].map(el => ({ ...el, location: states[getRandomInt(0, states.length - 1)] })),
         lowestPerformances: [
            {
               "terminalID": "1701205H",
               "date": "2023-05-22T23:00:00Z",
               "metrics": 5
            },
            {
               "terminalID": "1701545H",
               "date": "2023-05-22T23:00:00Z",
               "metrics": 4
            },
            {
               "terminalID": "17016714",
               "date": "2023-05-22T23:00:00Z",
               "metrics": 3
            },
            {
               "terminalID": "17015591",
               "date": "2023-05-22T23:00:00Z",
               "metrics": 2
            },
            {
               "terminalID": "17017122",
               "date": "2023-05-22T23:00:00Z",
               "metrics": 1
            }
         ].map(el => ({ ...el, location: states[getRandomInt(0, states.length - 1)] }))
      }
   },
   terminal_status_count: {
      singleton: true,
      url: "Statistics/TerminalStatusCount",
      data: {
         "IDLE": getRandomInt(3, 40),
         "Transaction In Progress": getRandomInt(2500, 3256),
         "Supervisor": 340,
         "Offline": 760
      }
   },
   low_cash_warning: {
      url: 'Statistics/LowCashWaringCount',
      data: {
         "savedDate": new Date().toISOString(),
         "formatedSavedDate": "string",
         "lowCashWarningCount": getRandomInt(100, 5_000)
      }
   },

   //CASH AUDIT PAGE
   cash_audit__cash_audit_count: {
      demo: true,
      url: 'Statistics/CashAuditCount',
      data: {
         "transactionDate": new Date().toISOString(),
         "totalTerminalCount": getRandomInt(2500, 15500),
         "totalCashLoaded": getRandomInt(2_900_000_000, 4_817_295_000),
         "totalCashAvailable": getRandomInt(200_000_000, 2_900_000_000),
         "totalCashWithdrawal": getRandomInt(200_000_000, 2_900_000_000),
      }
   },

   //REPORTS > TRANSACTION MANAGEMENT > EXCEPTIONS
   reports__exceptions: {
      url: 'Statistics/ReconciliationCount',
      data: {
         "transactionDate": new Date().toISOString(),
         "totalTransactions": getRandomInt(60_000, 79_913),
         "totalOnUsCount": getRandomInt(20_000, 40_000),
         "totalNotOnUsCount": getRandomInt(20_000, 40_913),
         "totalDispenseErrorCount": getRandomInt(10_000, 20_000),
         "totalUnImpactedCount": getRandomInt(1500, 15_000),
      }
   },

} as const

export default sampleAnalytics