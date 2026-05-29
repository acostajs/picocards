import { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import type { Card } from "../types";

export function useCardDeck(projectId: string | undefined) {
    const [cards, setCards] = useState<Card[]>([]);
    const [studyIndex, setStudyIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const projectCards = cards;

    // Fetch cards and reset index if deck changes
    useEffect(() => {
        setStudyIndex(0);
        setIsFlipped(false);

        if (projectId) {
            api.get<Card[]>(`/api/projects/${projectId}/cards`)
                .then((data) => {
                    setCards(data);
                })
                .catch((err) => {
                    console.error("Failed to fetch cards:", err);
                });
        } else {
            setCards([]);
        }
    }, [projectId]);

    function handleCreateCard(question: string, answer: string) {
        if (!projectId) return;
        api.post<Card>(`/api/projects/${projectId}/cards`, { question, answer })
            .then((newCard) => {
                setCards((prev) => [...prev, newCard]);
            })
            .catch((err) => {
                alert(err.message || "Failed to create card");
            });
    }

    function handleDeleteCard(id: string) {
        api.delete(`/api/cards/${id}`)
            .then(() => {
                setCards((prev) => prev.filter((c) => c.id !== id));
                if (studyIndex >= projectCards.length - 1 && studyIndex > 0) {
                    setStudyIndex((prev) => prev - 1);
                }
                setIsFlipped(false);
            })
            .catch((err) => {
                alert(err.message || "Failed to delete card");
            });
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
    };
}
