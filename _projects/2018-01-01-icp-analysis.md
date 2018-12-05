---
title: "Analysis of Iterative Closest Point Algorithm"
collection: projects
permalink: /projects/2018-01-01-icp-analysis
type: "Course Project"
venue: "Technical University of Munich"
date: 01-01-2018
location: "Munich, Germany"
---


This project evaluates several algorithms for iterative closest point algorithm. Iterative closest Point (ICP) is an algorithm employed to minimize the difference between two point clouds given an initial estimate of the relative pose. It is often used to reconstruct 2D or 3D surfaces from different scans, to localize robots and achieve optimal path planning and to register medical scans. ICP has several steps and each step may be implemented in various ways which give rise to a multitude of ICP variants. In our project, we implement and analyze several variants of ICP, comparing them on the basis of execution speed and quality of the result.

The steps of the algorithm are:  
1. **Selection** -- A set of points are selected from the source mesh. In the vanila implementation, these points are often selected randomly. Selecting more points than less usually leads to a more accurate registration but at the cost of execution speed.
2. **Matching** -- Selected points from the source mesh are transformed via the initial estimated relative pose and matched to the points in the target mesh. The aim here is to pair up points in the two meshes that actually both project to the same point in the real world model.
3. **Weighing** -- The matched points are accordingly weighted. A higher weight is often assigned to a more undesirable pair of matched points. In our implemented variants, we have uniformly weighed all the matched pairs.
4. **Rejection** -- Of the matched points, we reject the outliers - for instance, we may discard the pairs that are separated by a distance greater than some threshold.
5. **Error metric** -- We select an error metric for evaluating the matched pairs. For example, a point to point distance metric, or a point to plane distance metric.
6. **Optimizing technique** -- We must also select an optimization technique for minimizing the error metric for the corresponding pairs from the source and target meshes. For instance, we may opt for linear least squares or non-linear least squares.

The following poster showcases the experiments and the results from this project.  
![](https://dugarsumit.github.io/images/icp-poster.jpg)
 
[Source Code](https://github.com/dugarsumit/icp_analysis)