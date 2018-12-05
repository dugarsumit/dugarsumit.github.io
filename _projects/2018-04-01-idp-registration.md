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

![](https://dugarsumit.github.io/images/idp-overall-flow.png)

Our proposed system consists of four parts. Each part was handled by a different student. In the proposed system we first obtain a 3D scan of our patient via Kinect Fusion. We then segment the 3D scan into it’s constituent body parts and obtain the point cloud data for the part that interests us. Simultaneously we obtain the texture mapping for the 3D scan. In the final step we identify transformation between medical volumetric data and Kinect fusion model. For proper augmentation of medical data we need to find a transformation <sup>CT</sup>T<sub>HMD</sub> that can transform points from CT frame of reference to the HMD frame of reference i.e viewer’s reference frame. Since it is not easy to directly obtain this transformation so we will indirectly find this using the transformations <sup>CT</sup>T<sub>Kinect</sub> , <sup>Kinect</sup>T<sub>HMD</sub>.  But the transformation
<sup>Kinect</sup>T<sub>HMD</sub> is still missing. We can find this transformation by applying tracking
on Kinect and HMD.

![](https://dugarsumit.github.io/images/idp-registration-flow.png)

My goal of the project was to develop a registration pipeline for computing sup>CT</sup>T<sub>Kinect</sub> transformation i.e to obtain the transformation between CT data and the 3D Model obtained via Kinect Fusion. The registratiion system consists to two pipelines namely - Volume rendering pipeline and Registration pipeline. Overall registration system requires volumetric CT data and segmented point cloud as input. We get the segmented point cloud of a body part from a segmentation system. In the first step we generate point cloud of CT data using volume rendering pipeline. Once we have
both the point clouds we then, compute the transformation between CT data point cloud and segmented point cloud. The entire registration process happens in two steps. We first find a good initial
estimate of the transformation. For this, we use a correspondence matching strategy. Then we refine this estimated transformation using ICP in order to obtain the final transformation.


[For more details read section 3.2 of this report](https://dugarsumit.github.io/files/idp-report.pdf)  
[Source Code](https://gitlab.lrz.de/ga87yiq/mart/tree/master/registration) - Please email if you need access to the repository.