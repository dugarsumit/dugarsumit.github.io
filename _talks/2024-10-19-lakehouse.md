---
title: "An overview of Lakehouse Architecture"
collection: talks
type: "Check24 Data Science Summit"
permalink: /talks/2024-10-19-lakehouse
venue: "Check24"
date: 2024-10-19
location: "Munich, Germany"
---

The presentation explains the transition from traditional SQL-based data warehouses to a lakehouse architecture, highlighting the roles of DBT, Trino, and Apache Iceberg in building a modern data platform.

Motivation: Why Move to a Lakehouse
* Traditional warehouses have limitations in scalability, flexibility, and cost.
* A lakehouse combines:
    * Data lake scalability (cheap storage, flexibility)
    * Warehouse reliability (ACID guarantees, structured querying)
* Goal: unified platform for raw + processed + analytics-ready data.

Technology Choices (Rationale)
* Parquet → efficient columnar storage
* Iceberg → reliable table management on object storage
* Trino → fast distributed SQL query engine
* DBT → structured, maintainable transformation workflows

![](https://dugarsumit.github.io/images/lakehouse.png)

[For more details read this report](https://dugarsumit.github.io/files/lakehouse_architecture.pdf)
