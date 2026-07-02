console.log("Postgres / SSL Env variables:");
console.log(
  Object.keys(process.env)
    .filter(k => k.includes("SSL") || k.includes("PG") || k.includes("DATABASE") || k.includes("SQL"))
    .reduce((acc, k) => {
      acc[k] = k.includes("PASSWORD") ? "SET" : process.env[k];
      return acc;
    }, {})
);
