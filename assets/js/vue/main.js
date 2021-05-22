const fs = require("fs");
const faker = require("faker");
const path = require('path')
new Vue({
    el: "#app",
    data: {
        options: [
            {
                name: "address",
                options: ["zipCode", "city", "streetName", "streetAddress", "streetSuffix", "streetPrefix", "county", "country", "countryCode", "state", "stateAbbr", "latitude", "longitude"]
            },
            {
                name: "commerce",
                options: ["color", "department", "productName", "price", "productAdjective", "productMaterial", "product"]
            },
            {
                name: "company",
                options: ["suffixes", "companyName", "companySuffix", "catchPhrase", "bs", "catchPhraseAdjective", "catchPhraseDescriptor", "catchPhraseNoun", "bsAdjective", "bsBuzz", "bsNoun"]
            },
            {
                name: "database",
                options: ["column", "type", "collation", "engine"]
            },
            {
                name: "date",
                options: ["past", "future", "between", "recent", "soon", "month", "weekday"]
            },
            {
                name: "internet",
                options: ["avatar", "email", "exampleEmail", "userName", "protocol", "url", "domainName", "domainSuffix", "domainWord", "ip", "ipv6", "userAgent", "color", "mac", "password"]
            },
            {
                name: "name",
                options: ["firstName", "lastName", "findName", "jobTitle", "prefix", "suffix", "title", "jobDescriptor", "jobArea", "jobType"]
            },
            {
                name: "phone",
                options: ["phoneNumber", "phoneNumberFormat", "phoneFormats"]
            },
            {
                name: "random",
                options: ["number", "float", "arrayElement", "objectElement", "uuid", "boolean", "word", "words", "image", "locale", "alphaNumeric", "hexaDecimal"]
            },
            {
                name: "image",
                options: ["image", "avatar", "imageUrl", "abstract", "animals", "cats", "city", "food", "nightlife", "fashion", "people", "nature"]
            }
        ],
        typesOutput: ["sql", "json", "csv", "txt"],
        fields: [
            {
                name: "name",
                optOne: {
                    name: "name",
                    options: ["firstName", "lastName", "findName", "jobTitle", "prefix", "suffix", "title", "jobDescriptor", "jobArea", "jobType"]
                },
                optTwo: "firstName"
            }
        ],
        quantity: 100,
        typeOutput: "sql",
        fileOutput: __dirname,
        tableName: "public"
    },
    created() {
    },
    mounted() {
        $('input').tooltip();
    },
    methods: {
        close() {
            window.close();
        },
        deleteIndex(index) {
            console.log(index);
            this.fields.splice(index, 1);
        },

        addField() {
            this.fields.push({
                name: "name",
                optOne: {
                    name: "name",
                    options: ["firstName", "lastName", "findName", "jobTitle", "prefix", "suffix", "title", "jobDescriptor", "jobArea", "jobType"]
                },
                optTwo: "firstName"
            });
        },
        generateData() {
            let data = [];
            for (let i = 0; i < this.quantity; i++) {
                data = [
                    ...data,
                    this.fields.reduce((before, field) => {
                        return {
                            ...before,
                            [field.name]: faker[field.optOne.name][field.optTwo]()
                        };
                    }, {})
                ];
            }
            return [data, Object.keys(data[0])];
        },
        createData() {
            let [data, headers] = this.generateData();
            switch (this.typeOutput) {
                case "sql":
                    this.formatSQL(data, headers);
                    break;
                case "csv":
                    this.formatCSV(data);
                    break;
                default:
                    this.downloadData(JSON.stringify(data));
                    break;
            }
        },
        downloadData(data) {
            // let blob = new Blob([data], { type: "octet/stream" });
            // saveAs(blob, `data.${this.typeOutput}`);
            fs.writeFile(path.join(this.fileOutput, `data.${this.typeOutput}`), data, err => {
                console.log(err)
            });
            // let url = window.URL.createObjectURL(blob);
            // var a = document.createElement("a");
            // a.href = url;
            // a.download = `data.${this.typeOutput}`;
            // a.click();
            // window.URL.revokeObjectURL(url);
        },
        formatCSV(data) {
            let doc = Papa.unparse(data, {download: true});
            this.downloadData(doc);
        },
        formatSQL(data, headers) {
            let values = headers.reduce((before, after) => (before += ` ${after},`), "").slice(1, -1);
            let inserts = data.reduce((before, after) => {
                let headersFormat = headers.reduce((b, a) => {
                    return (b += ` '${after[a].replace(/'/g, "")}\',`);
                }, "");
                return (before += `INSERT INTO ${this.tableName}(${values})
                                   VALUES (${headersFormat.slice(1, -1)});  `);
            }, "");
            this.downloadData(inserts);
        }
    }
});
