import { renderHook } from "@testing-library/react-hooks";

import { MockJSONServer, TestWrapper } from "@test";

import { useUpdate } from "./useUpdate";

describe("useUpdate Hook", () => {
    it("should works with pessimistic update", async () => {
        const { result, waitForNextUpdate, waitFor } = renderHook(
            () => useUpdate("posts", "pessimistic"),
            {
                wrapper: TestWrapper({
                    dataProvider: MockJSONServer,
                    resources: [{ name: "posts" }],
                }),
            },
        );

        result.current.mutate({
            id: "1",
            values: { id: "1", title: "test" },
        });
        await waitForNextUpdate();

        await waitFor(() => {
            return result.current.isSuccess;
        });

        const { isSuccess, data } = result.current;

        expect(isSuccess).toBeTruthy();
        expect(data?.data.title).toBe("test");
    });
    it("should works with optimistic update", async () => {
        const { result, waitForNextUpdate, waitFor } = renderHook(
            () => useUpdate("posts", "optimistic"),
            {
                wrapper: TestWrapper({
                    dataProvider: MockJSONServer,
                    resources: [{ name: "posts" }],
                }),
            },
        );

        result.current.mutate({
            id: "1",
            values: { id: "1", title: "optimistic test" },
        });
        await waitForNextUpdate();

        await waitFor(() => {
            return result.current.isSuccess;
        });

        const { isSuccess, data } = result.current;

        expect(isSuccess).toBeTruthy();
        expect(data?.data.title).toBe("optimistic test");
    });
});
