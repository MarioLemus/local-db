import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ArrayType, ObjectType } from "../types";
import { jsonStringify } from "./util/jsonStringify";

// * create and delete method has to implement almost the same functionality
// * data is not been saved always as it should be
//  * E.g -> if create() method is instantiated 2 times and data is passed as a param.
//  * data is saved just the second time, while the first time is not
class LocalDB {
  private rootPath: string;
  private tempDatHolder: ArrayType;

  constructor() {
    this.rootPath = path.join(process.cwd(), "db.json");
    this.tempDatHolder = [];
  }

  public async create(data: ObjectType): Promise<ObjectType> {
    if (typeof data !== "object") {
      throw new Error("Received arg. must be a valid object");
    }

    if (Object.keys(data).length === 0) {
      throw new Error("Received arg. must be a 'key, value' pair");
    }

    if (
      Object.keys(data).includes("id") ||
      Object.keys(data).includes("_id") ||
      Object.keys(data).includes("ID") ||
      Object.keys(data).includes("_ID")
    ) {
      throw new Error(
        "'ID' property has been set automatically, do not add it manually"
      );
    }

    if (Object.keys(data).includes("_creationDate")) {
      throw new Error(
        "'_creationDate' property has been set automatically, do not add it manually"
      );
    }

    const userData = Object.assign(
      {
        _id: uuidv4(),
        _creationDate: new Date(),
      },
      data
    );

    this.tempDatHolder.push(...JSON.parse(await this.readAll()));
    this.tempDatHolder.push(userData);
    const sortData = this.tempDatHolder.sort((a, b) => {
      // @ts-ignore
      return new Date(a._creationDate) - new Date(b._creationDate);
    });

    // Quit duplicate objs.
    const f = sortData.filter((obj, i) => {
      if (i + 1 === sortData.length) return;
      // @ts-ignore
      if (obj._id !== sortData[i + 1]._id) return obj;
    });

    console.log(f);

    await fs.writeFile(this.rootPath, jsonStringify(f));

    this.tempDatHolder = [];

    return {};
  }

  public async readAll() {
    try {
      const data = await fs.readFile(this.rootPath);
      return await data.toString();
    } catch (error) {
      console.error("An error has occured while trying to fetch data...");
      throw error;
    }
  }

  public async readOne(_id: string) {
    const savedData = JSON.parse(await this.readAll());
    if (savedData.length === 0) {
      throw new Error("There is not any data saved");
    }

    const data = savedData.find((data: ObjectType) => data._id === _id);
    if (!data) {
      throw new Error(`Any element can be found with the following ID: ${_id}`);
    }
    return data;
  }
}

const localDB = new LocalDB();
/*
options = {
  uniqueElements: true -> avoid key, value duplication,
  singleInstance: true -> creates a singleton to avoid multiple instances
}
*/
const a = {
  name: "carl",
  name2: "mokey",
};

const b = {
  name: "goku",
  name2: "roshi",
};

const c = {
  name: "koala",
  name2: "koala-master",
};

const d = {
  name: "sola",
  name2: "benitez",
};

const e = {
  name: "web",
  name2: "zoo",
};

const f = {
  name: "zooalnder",
  name2: "bruh!",
};

let temp = [a, b];

// tests
async function main() {
  // temp.forEach((aaa) => {
  //   zzz.create(aaa);
  // });
  localDB.create(a);
  localDB.create(b);
  localDB.create(c); // ! data hasn't been added
  localDB.create(d);
  localDB.create(e); // ! data hasn't been added
  localDB.create(f);
  // console.log(await zzz.readOne("a88840f0-61e5-49b1-a265-fda35afb9afcx"));
  // console.log(await zzz.readAll());
}

main();
