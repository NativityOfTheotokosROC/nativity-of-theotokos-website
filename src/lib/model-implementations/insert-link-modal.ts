import {
	ViewInteractionInterface,
	useNewStatefulInteractiveModel,
} from "@mvc-react/stateful";
import {
	InsertLinkModalModelInteraction,
	InsertLinkModalModelView,
	NewLink,
} from "../models/insert-link-modal";
import { UninitializedModelError } from "../utilities/errors";

export function insertLinkModalVIInterface({
	insertLinkCallback,
}: {
	insertLinkCallback: (newLink: NewLink) => void;
}) {
	return {
		async produceModelView(interaction, currentModelView) {
			switch (interaction.type) {
				case "OPEN": {
					const { initialLinkDetails } = interaction.input;
					return { isOpen: true, initialLinkDetails };
				}
				case "CLOSE": {
					if (!currentModelView) throw new UninitializedModelError();
					return { ...currentModelView, isOpen: false };
				}
				case "INSERT_LINK": {
					if (!currentModelView) throw new UninitializedModelError();
					insertLinkCallback(interaction.input);
					return {
						...currentModelView,
						initialLinkDetails: undefined,
						isOpen: false,
					};
				}
			}
		},
	} satisfies ViewInteractionInterface<
		InsertLinkModalModelView,
		InsertLinkModalModelInteraction
	>;
}

export function useInsertLinkModal({
	insertLinkCallback,
}: {
	insertLinkCallback: (newLink: NewLink) => void;
}) {
	const model = useNewStatefulInteractiveModel(
		insertLinkModalVIInterface({ insertLinkCallback }),
	);
	return model;
}
