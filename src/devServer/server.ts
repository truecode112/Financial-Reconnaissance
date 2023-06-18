import { createServer, Response } from "miragejs"
import { baseUrl, GLOBAL_API_URLS, queryLimit } from "../lib/fetch"
import sampleArchives from "./sampleData/sampleArchives"
import { darkImage, faultyCamera } from "./sampleData/sampleAtmManagement"
import sampleCashAudit from "./sampleData/sampleCashAudit"
import sampleCashEvacuated from "./sampleData/sampleCashEvacuated"
import sampleConfigureAtm from "./sampleData/sampleConfigureAtm"
import { jwt, states as sampleStates, userRoles } from "./sampleData/sampleData"
import sampleExceptions, { networkError as sampleNetworkError } from "./sampleData/sampleExceptions"
import sampleFootageSearch from "./sampleData/sampleFootageSearch"
import sampleJournalSearch from "./sampleData/sampleJournalSearch"
import sampleLicense from "./sampleData/sampleLicense"
import { auditTrail, loginAudit } from "./sampleData/sampleLoginAudit"
import sampleMastercard, { balanceEscalation, duplicateReversal, prepaidCardException, remoteWebException, vtuException } from "./sampleData/sampleMastercard"
import { matchedItems, outstandingSettlement, summary } from "./sampleData/sampleNIP"
import sampleTrxManagement, { fundTransfer } from "./sampleData/sampleTransactionsManagement"
import sampleTrxInvestigation from "./sampleData/sampleTrxInv"
import sampleUserList from "./sampleData/sampleUserList"
import sampleAnalytics from "./sampleData/_sampleAnalytics"
import { differenceInDays, subDays } from "date-fns"
import { getRandomInt, isValidNumber } from "@/lib/numbers"

console.log('server.ts');

function populate(sample: _Object[], count = queryLimit) {
   const chunk = sample.slice(0, count)
   let res = chunk
   while (res.length < (count) && sample.length > 0) {
      res.push(...chunk)
   }
   return res
}

export default function server() {
  console.log('createServer');
   createServer({
      routes() {
         this.timing = 2000
         this.logging = false
         // Login
         this.post(baseUrl + "Passport/login", (_, req) => {
            const { username, password } = JSON.parse(req.requestBody)
            // return new Response(500)
            if (username !== "username" && password !== "password") {
               return new Response(401)
            }
            return {
               token: jwt,
               username: "TMP10283"
            }
         })
         // Logout
         this.post(baseUrl + "Passport/logout", () => {
            return true
         }, { timing: 4000 })

         // Refresh token
         this.post(baseUrl + "Passport/validate", () => ({ token: jwt, username: "TMP10283" }))

         // Trx Management > Journals
         this.get(baseUrl + "journals", () => {
            return sampleJournalSearch
         })

         // Trx Management > Footages
         this.get(baseUrl + "footages", () => {
            return populate(sampleFootageSearch)
         })

         // Trx Management > Transaction Investigation
         this.get(baseUrl + "exceptions/traninvestigation", () => {
            return populate(sampleTrxInvestigation)
         })

         // Trx Management > Exceptions > networkError
         this.get(baseUrl + "exceptions/skippedTransactions", () => {
            return populate(sampleNetworkError)
         })

         // Trx Management > Exceptions > networkError
         this.get(baseUrl + "exceptions/fundtransfer", () => {
            return populate(fundTransfer)
         })
         this.get(baseUrl + "exceptions/summary", () => {
            return summary
         })

         // Trx Management > Exceptions
         /**
         * this /exceptions/ root route is used by multiple callers
         * for exceptions page it can be narrowed down to the caller id
         * instead of using the wildcard (which is used at the end of this file)
         */
         this.get(baseUrl + "exceptions/:id", (_, req) => {
            //EXCEPTIONS
            if (req.params.id.match(/overages|shortages|skippedtransactions/gi)) {
               return populate(sampleExceptions)
            }
            //TSS
            if (req.params.id === 'summary') {
               return summary
            }
            //NIP
            if (req.params.id.match(/outstandinginflow|outstandingtss/gi)) {
               return populate(outstandingSettlement)
            }
            return populate(matchedItems)
         })
         // Trx Management > Exceptions > post
         this.post(baseUrl + "exceptions/*", (_, req) => {
            return { status: true, data: req.requestBody }
         })

         // ATM Management > Configure ATM
         this.get(baseUrl + "atms/terminals", () => {
            return populate(sampleConfigureAtm)
         })
         // ATM Management > Configure ATM > Update
         this.put(baseUrl + "atms/update", (_, req) => {
            const body = JSON.parse(req.requestBody)
            return {
               status: true,
               data: body
            }
         })

         // ATM Management > Configure ATM > Search
         this.get(baseUrl + "atms/search", () => {
            return populate(sampleConfigureAtm)
         })

         // Reports > Transaction Management
         this.get(baseUrl + "exceptions/report", () => {
            return populate(sampleTrxManagement)
            // return new Response(401)
         })
         // Reports > Trx Management > Dispense error...
         this.get(baseUrl + "exceptions/skippedTransactionReport", () => {
            return populate(sampleNetworkError)
         })
         // Reports > Trx Management > Exceptions
         this.get(baseUrl + "atms/nojournalpostings", () => {
            return populate(sampleConfigureAtm)
         })

         // Reports > ATM Management
         this.get(baseUrl + "atms/darkImage", () => {
            return populate(darkImage)
         })
         // Reports > ATM Management
         this.get(baseUrl + "atms/faultyCamera", () => {
            return populate(faultyCamera)
         })

         // Cash Management > Cash Audit
         this.get(baseUrl + "statistics/balance", () => {
            return sampleCashAudit
         })
         // Cash Management > Cash Audit
         this.get(baseUrl + "statistics/balancelist", () => {
            return populate([sampleCashAudit])
         })
         // Cash Management > Cash Evacuated
         this.get(baseUrl + "statistics/getcash", () => {
            return populate(sampleCashEvacuated)
         })
         // Cash Management > Cash Evacuated > PUT
         this.put(baseUrl + "statistics/update", (_, req) => {
            return { status: true, data: JSON.parse(req.requestBody) }
         })

         // User Management > User List
         this.get(baseUrl + "passport/users", () => {
            return populate(sampleUserList)
         })
         // User Management > Modify User
         this.put(baseUrl + "passport/updateuser", () => {
            return { status: true, message: "", data: [] }
         })
         // User Management > Create User
         this.post(baseUrl + "passport/register", (_, req) => {
            return { status: true, message: "", data: req.requestBody }
         })
         // Select > Roles
         this.get(baseUrl + "passport/roles", () => userRoles)
         // this.get(baseUrl + "passport/roles", () => new Response(401))

         // Select > Brands
         this.get(baseUrl + "atms/brands", () => ["NCR CSDP", "NCR", "Hyosung CSDP", "Hyosung"])

         // User Management > Audit Trail
         this.get(baseUrl + "businesslogs/list", () => {
            return populate(auditTrail)
         })

         // User Management > Login Audit
         this.get(baseUrl + "passport/trails", () => {
            return populate(loginAudit)
         })

         // Select > States
         this.get(baseUrl + "passport/states", () => sampleStates)

         this.get(baseUrl + "atms/*", () => {
            // return new Response(404)
            return Math.random() * 5000
         })

         // Archives
         this.get(baseUrl + "archives/list", () => {
            return populate(sampleArchives, 5)
         })
         this.get(baseUrl + "archives/*", () => {
            return sampleArchives[0]
         })
         this.post(baseUrl + "archives/*", () => {
            return sampleArchives[0]
         })

         // Licenses
         this.get(baseUrl + "license/current", () => {
            const randomNumber = Math.floor(Math.random() * 50)
            sampleLicense['daysRemaining'] = String(Math.random() > 0.5 ?
               randomNumber * -1 : randomNumber)
            return sampleLicense
            // return new Response(403)
         })
         this.post(baseUrl + "license/activate", (_, req) => {
            const randomNumber = Math.floor(Math.random() * 50)
            const body = JSON.parse(req.requestBody)
            sampleLicense['currentCode'] = body.code
            sampleLicense['daysRemaining'] = String(Math.random() > 0.5 ?
               randomNumber * -1 : randomNumber)
            return sampleLicense
         })

         /**
          * Chart analytics data
          */
         populateAnalyticsRoutes(this)


         /**
          * NIP and POS
          */
         // Mastercard >
         this.get(GLOBAL_API_URLS.mastercard + "/rmwexception", () => {
            return populate(remoteWebException)
         })
         // Mastercard >
         this.get(GLOBAL_API_URLS.mastercard + "/vtuexception", () => {
            return populate(vtuException)
         })
         // Mastercard >
         this.get(GLOBAL_API_URLS.mastercard + "ppcexception", () => {
            return populate(prepaidCardException)
         })
         // Mastercard > Matched Items
         this.get(GLOBAL_API_URLS.mastercard + "*", (_, req) => {
            if (req.url.match(/count$/i)) {
               return {
                  count: String(Math.floor(Math.random() * 5000))
               }
               // return new Response(404)
            }
            if (req.url.match(/settlementescalation|balanceescalation/gi)) {
               return populate(balanceEscalation)
            }
            if (req.url.match(/duplicate/gi)) {
               return populate(duplicateReversal)
            }
            return populate(sampleMastercard)
         })

      }
   })
}

function populateAnalyticsRoutes(server: ReturnType<typeof createServer>) {
   for (const entry in sampleAnalytics) {
      const current = (sampleAnalytics as _Object)[entry]
      const data = current.data as _Object

      server.get(`${baseUrl}/${current.url}`, (_, req) => {
         const { dateFrom, dateTo } = req.queryParams
         // return new Response(400)

         if ('singleton' in current) {
            const obj = {} as _Object
            for (const key in current.data) {
               const value = current.data[key]
               obj[key] = value
               if (isValidNumber(value)) {
                  obj[key] = getRandomInt(value / 2, value)
               }
            }
            return obj
         } else {
            const response = []
            let count = 6

            if (dateFrom && dateTo) {
               count = differenceInDays(new Date(dateTo), new Date(dateFrom))
            }

            //Random data generator
            for (let i = count + 1; i > 0; i--) {
               const obj: _Object = {}

               for (const key in data) {
                  obj[key] = data[key]

                  if (key.match(/date/gi)) {
                     obj[key] = subDays(new Date(), i - 1).toISOString()
                  } else if (isValidNumber(data[key])) {
                     const max = +data[key]
                     const min = max / 2;
                     obj[key] = getRandomInt(min, max)
                  }
               }

               response.push(obj)
            }

            return response
         }
      }, { timing: getRandomInt(2300, 3000) })
   }
}