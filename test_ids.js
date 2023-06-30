const EPOCH = 1_620_070_400_000;
let INCREMENT = BigInt(0);

function generate(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
      throw new TypeError(
        `"timestamp" argument must be a number (received ${isNaN(timestamp) ? 'NaN' : typeof timestamp})`,
      );
    }
    if (INCREMENT >= 4095n) INCREMENT = BigInt(0);

    // Assign WorkerId as 1 and ProcessId as 0:
    return ((BigInt(timestamp - EPOCH) << 22n) | (1n << 17n) | INCREMENT++).toString();
  }


  console.log(generate())
  console.log(generate())
  console.log(generate())
  console.log(generate())
  console.log(generate())
  console.log(generate())
  console.log(generate())
  console.log(generate())
  console.log(generate())
  console.log(generate())
  console.log(generate())
  console.log(generate())
  console.log(generate())
  console.log(generate())
