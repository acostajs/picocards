import { useEffect, useState } from "react";
import type { Card } from "../types";

export function useCardDeck(
    projectId: string | undefined,
    initialCards: Card[],
) {
    const [cards, setCards] = useState<Card[]>(initialCards);
    const [studyIndex, setStudyIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const projectCards = cards.filter((c) => c.project_id === projectId);

    // Reset index if deck changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: Reset active indices whenever the projectId routes change.
    useEffect(() => {
        setStudyIndex(0);
        setIsFlipped(false);
    }, [projectId]);

    function handleCreateCard(question: string, answer: string) {
        const newCard: Card = {
            id: `card-${Date.now()}`,
            project_id: projectId || "proj-1",
            question,
            answer,
        };
        setCards((prev) => [...prev, newCard]);
    }

    function handleDeleteCard(id: string) {
        setCards((prev) => prev.filter((c) => c.id !== id));
        if (studyIndex >= projectCards.length - 1 && studyIndex > 0) {
            setStudyIndex((prev) => prev - 1);
        }
        setIsFlipped(false);
    }

    function handlePrev() {
        if (projectCards.length === 0) return;
        setIsFlipped(false);
        setStudyIndex(
            (prev) => (prev - 1 + projectCards.length) % projectCards.length,
        );
    }

    function handleNext() {
        if (projectCards.length === 0) return;
        setIsFlipped(false);
        setStudyIndex((prev) => (prev + 1) % projectCards.length);
    }

    function handleShuffle() {
        if (projectCards.length <= 1) return;
        setIsFlipped(false);
        let randIndex = studyIndex;
        while (randIndex === studyIndex) {
            randIndex = Math.floor(Math.random() * projectCards.length);
        }
        setStudyIndex(randIndex);
    }

    return {
        projectCards,
        studyIndex,
        isFlipped,
        setIsFlipped,
        handleCreateCard,
        handleDeleteCard,
        handlePrev,
        handleNext,
        handleShuffle,
        setStudyIndex,
    };
}

export default useCardDeck;
