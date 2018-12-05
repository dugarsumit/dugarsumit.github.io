---
title: "Development of a system that allows registration of segmented point cloud to patient CT data and provide augmentations"
collection: projects
permalink: /projects/2018-04-01-idp-registration
type: "Interdisciplinary Project"
venue: "Technical University of Munich"
date: 01-04-2018
location: "Munich, Germany"
---


In this project we are trying to develop a system that will augment the volumetric medical images onto a segmented body part. In order to correctly augment medical information onto the patient it is essential to accurately determine the transformation between the current pose of the patient, the viewing point of the observer, and the associated medical image data. The required transformations can be estimated by registering the surface (skin) of the patient with a surface extracted from the associated volumetric scans.

Our proposed system consists of four parts. Each part was handled by a different student. In the proposed system we first obtain a 3D scan of our patient via Kinect Fusion. We then segment the 3D scan into it’s constituent body parts and obtain the point cloud data for the part that interests us. Simultaneously we obtain the texture mapping for the 3D scan. In the final step we identify transformation between medical volumetric data and Kinect fusion model. 

![ATS](https://dugarsumit.github.io/images/makehuman-blender-flow.png)

For proper augmentation of medical data we need to find a transformation <sup>CT</sup>T<sub>HMD</sub> that can transform points from CT frame of reference to the HMD frame of reference i.e viewer’s reference frame. Since it is not easy to directly obtain this transformation so we will indirectly find this using the transformations <sup>CT</sup>T<sub>Kinect</sub> , <sup>Kinect</sup>T<sub>HMD</sub>.


[For more details read section 3.2 of this report](https://dugarsumit.github.io/files/idp-report.pdf)  
[Source Code](https://github.com/dugarsumit/makehuman_blender)