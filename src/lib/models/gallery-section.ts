import { Model } from "@mvc-react/mvc";
import { GalleryImage } from "../types/general";

export interface GallerySectionModelView {
	galleryImages: GalleryImage[];
}

export type GallerySectionModel = Model<GallerySectionModelView>;
