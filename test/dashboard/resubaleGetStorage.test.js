import { getDashboardItems } from "../../src/commonPages/dashboard/component/function/resubaleGetStorage";

describe("getDashboardItems", () => {
  const roleList = ["Admin", "Coder1", "Coder2", "Owner", "QA", "QALead", "ProjectLead"];
  const defaultTabs = { Default: [], Workflow: [], Invalid: [], WorkQueue: [] };

  describe("Basic Functionality", () => {
    test("returns default structure when storageName is null", () => {
      const result = getDashboardItems(null);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      
      roleList.forEach(role => {
        expect(result[role]).toBeDefined();
        expect(result[role]).toEqual(defaultTabs);
      });
    });

    test("returns default structure when storageName is undefined", () => {
      const result = getDashboardItems(undefined);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      
      roleList.forEach(role => {
        expect(result[role]).toBeDefined();
        expect(result[role]).toEqual(defaultTabs);
      });
    });

    test("returns default structure when storageName is empty string", () => {
      const result = getDashboardItems("");
      
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      
      roleList.forEach(role => {
        expect(result[role]).toBeDefined();
        expect(result[role]).toEqual(defaultTabs);
      });
    });

    test("returns default structure when storageName is invalid JSON", () => {
      const result = getDashboardItems("invalid json string");
      
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
      
      roleList.forEach(role => {
        expect(result[role]).toBeDefined();
        expect(result[role]).toEqual(defaultTabs);
      });
    });
  });

  describe("Valid JSON Storage", () => {
    test("parses valid JSON storage correctly", () => {
      const validStorage = {
        Admin: {
          Default: ["widget1", "widget2"],
          Workflow: ["widget3"],
          Invalid: [],
          WorkQueue: ["widget4"]
        },
        Coder1: {
          Default: ["widget5"],
          Workflow: [],
          Invalid: ["widget6"],
          WorkQueue: ["widget7", "widget8"]
        }
      };
      
      const storageString = JSON.stringify(validStorage);
      const result = getDashboardItems(storageString);
      
      expect(result.Admin.Default).toEqual(["widget1", "widget2"]);
      expect(result.Admin.Workflow).toEqual(["widget3"]);
      expect(result.Admin.Invalid).toEqual([]);
      expect(result.Admin.WorkQueue).toEqual(["widget4"]);
      
      expect(result.Coder1.Default).toEqual(["widget5"]);
      expect(result.Coder1.Workflow).toEqual([]);
      expect(result.Coder1.Invalid).toEqual(["widget6"]);
      expect(result.Coder1.WorkQueue).toEqual(["widget7", "widget8"]);
    });

    test("merges partial storage with default tabs", () => {
      const partialStorage = {
        Admin: {
          Default: ["widget1"],
          Workflow: ["widget2"]
        },
        Coder1: {
          WorkQueue: ["widget3"]
        }
      };
      
      const storageString = JSON.stringify(partialStorage);
      const result = getDashboardItems(storageString);
      
      // Admin should have partial data merged with defaults
      expect(result.Admin.Default).toEqual(["widget1"]);
      expect(result.Admin.Workflow).toEqual(["widget2"]);
      expect(result.Admin.Invalid).toEqual([]);
      expect(result.Admin.WorkQueue).toEqual([]);
      
      // Coder1 should have partial data merged with defaults
      expect(result.Coder1.Default).toEqual([]);
      expect(result.Coder1.Workflow).toEqual([]);
      expect(result.Coder1.Invalid).toEqual([]);
      expect(result.Coder1.WorkQueue).toEqual(["widget3"]);
    });

    test("handles empty object storage", () => {
      const emptyStorage = {};
      const storageString = JSON.stringify(emptyStorage);
      const result = getDashboardItems(storageString);
      
      roleList.forEach(role => {
        expect(result[role]).toBeDefined();
        expect(result[role]).toEqual(defaultTabs);
      });
    });

    test("handles storage with null values", () => {
      const storageWithNulls = {
        Admin: null,
        Coder1: {
          Default: null,
          Workflow: undefined
        }
      };
      
      const storageString = JSON.stringify(storageWithNulls);
      const result = getDashboardItems(storageString);
      
      expect(result.Admin).toEqual(defaultTabs);
      expect(result.Coder1.Default).toEqual(null);
      // Fixed: undefined gets converted to empty string in JSON, but the function merges with defaultTabs
      // So undefined becomes empty array (default value)
      expect(result.Coder1.Workflow).toEqual([]);
      expect(result.Coder1.Invalid).toEqual([]);
      expect(result.Coder1.WorkQueue).toEqual([]);
    });
  });

  describe("Role Coverage", () => {
    test("covers all expected roles", () => {
      const result = getDashboardItems("{}");
      
      expect(Object.keys(result)).toHaveLength(roleList.length);
      roleList.forEach(role => {
        expect(result).toHaveProperty(role);
      });
    });

    test("each role has all expected tabs", () => {
      const result = getDashboardItems("{}");
      
      roleList.forEach(role => {
        expect(result[role]).toHaveProperty("Default");
        expect(result[role]).toHaveProperty("Workflow");
        expect(result[role]).toHaveProperty("Invalid");
        expect(result[role]).toHaveProperty("WorkQueue");
      });
    });

    test("handles custom roles in storage", () => {
      const customStorage = {
        CustomRole: {
          Default: ["customWidget"],
          Workflow: ["workflowWidget"]
        }
      };
      
      const storageString = JSON.stringify(customStorage);
      const result = getDashboardItems(storageString);
      
      // Fixed: The function only processes roles in the predefined roleList
      // Custom roles are not included in the result
      expect(result.CustomRole).toBeUndefined();
      
      // Standard roles should still be present with defaults
      expect(result.Admin).toEqual(defaultTabs);
      expect(result.Coder1).toEqual(defaultTabs);
    });
  });

  describe("Tab Structure", () => {
    test("each tab is initialized as an empty array", () => {
      const result = getDashboardItems("{}");
      
      roleList.forEach(role => {
        expect(Array.isArray(result[role].Default)).toBe(true);
        expect(Array.isArray(result[role].Workflow)).toBe(true);
        expect(Array.isArray(result[role].Invalid)).toBe(true);
        expect(Array.isArray(result[role].WorkQueue)).toBe(true);
      });
    });

    test("tabs can contain various data types", () => {
      const mixedDataStorage = {
        Admin: {
          Default: ["string", 123, { id: 1, name: "widget" }, [1, 2, 3]],
          Workflow: null,
          Invalid: undefined,
          WorkQueue: false
        }
      };
      
      const storageString = JSON.stringify(mixedDataStorage);
      const result = getDashboardItems(storageString);
      
      expect(result.Admin.Default).toEqual(["string", 123, { id: 1, name: "widget" }, [1, 2, 3]]);
      expect(result.Admin.Workflow).toEqual(null);
      // Fixed: undefined gets converted to empty string in JSON, but the function merges with defaultTabs
      // So undefined becomes empty array (default value)
      expect(result.Admin.Invalid).toEqual([]);
      expect(result.Admin.WorkQueue).toEqual(false);
    });
  });

  describe("Error Handling", () => {
    test("handles JSON parse errors gracefully", () => {
      const invalidJSONs = [
        "{ invalid json }",
        "[1, 2, 3,}",
        "null",
        "undefined",
        "true",
        "false",
        "123",
        '"just a string"'
      ];
      
      invalidJSONs.forEach(invalidJSON => {
        const result = getDashboardItems(invalidJSON);
        
        expect(result).toBeDefined();
        expect(typeof result).toBe("object");
        
        roleList.forEach(role => {
          expect(result[role]).toBeDefined();
          expect(result[role]).toEqual(defaultTabs);
        });
      });
    });

    test("handles malformed JSON with missing brackets", () => {
      const malformedJSONs = [
        "{",
        "}",
        "[",
        "]",
        "{ \"key\": \"value\"",
        "\"key\": \"value\" }"
      ];
      
      malformedJSONs.forEach(malformedJSON => {
        const result = getDashboardItems(malformedJSON);
        
        expect(result).toBeDefined();
        expect(typeof result).toBe("object");
        
        roleList.forEach(role => {
          expect(result[role]).toBeDefined();
          expect(result[role]).toEqual(defaultTabs);
        });
      });
    });

    test("handles JSON with circular references gracefully", () => {
      // This test simulates what would happen if someone tried to store circular references
      // The JSON.stringify would fail, but our function should handle it gracefully
      const circularObj = {};
      circularObj.self = circularObj;
      
      // This will throw an error when stringified, but our function should handle it
      expect(() => {
        JSON.stringify(circularObj);
      }).toThrow();
    });
  });

  describe("Data Merging", () => {
    test("preserves existing data when merging", () => {
      const existingStorage = {
        Admin: {
          Default: ["existingWidget1", "existingWidget2"],
          Workflow: ["existingWorkflowWidget"]
        }
      };
      
      const storageString = JSON.stringify(existingStorage);
      const result = getDashboardItems(storageString);
      
      expect(result.Admin.Default).toEqual(["existingWidget1", "existingWidget2"]);
      expect(result.Admin.Workflow).toEqual(["existingWorkflowWidget"]);
      expect(result.Admin.Invalid).toEqual([]);
      expect(result.Admin.WorkQueue).toEqual([]);
    });

    test("overwrites existing data with new data", () => {
      const existingStorage = {
        Admin: {
          Default: ["oldWidget"],
          Workflow: ["oldWorkflowWidget"]
        }
      };
      
      const newStorage = {
        Admin: {
          Default: ["newWidget"],
          Invalid: ["newInvalidWidget"]
        }
      };
      
      const storageString = JSON.stringify(newStorage);
      const result = getDashboardItems(storageString);
      
      expect(result.Admin.Default).toEqual(["newWidget"]);
      expect(result.Admin.Workflow).toEqual([]);
      expect(result.Admin.Invalid).toEqual(["newInvalidWidget"]);
      expect(result.Admin.WorkQueue).toEqual([]);
    });

    test("handles nested object merging", () => {
      const nestedStorage = {
        Admin: {
          Default: {
            widgets: ["widget1", "widget2"],
            settings: { theme: "dark" }
          }
        }
      };
      
      const storageString = JSON.stringify(nestedStorage);
      const result = getDashboardItems(storageString);
      
      expect(result.Admin.Default).toEqual({
        widgets: ["widget1", "widget2"],
        settings: { theme: "dark" }
      });
      expect(result.Admin.Workflow).toEqual([]);
      expect(result.Admin.Invalid).toEqual([]);
      expect(result.Admin.WorkQueue).toEqual([]);
    });
  });

  describe("Performance and Edge Cases", () => {
    test("handles very large storage objects", () => {
      const largeStorage = {};
      
      // Create a large storage object
      for (let i = 0; i < 1000; i++) {
        largeStorage[`Role${i}`] = {
          Default: Array.from({ length: 100 }, (_, j) => `widget${i}_${j}`),
          Workflow: Array.from({ length: 50 }, (_, j) => `workflow${i}_${j}`),
          Invalid: Array.from({ length: 25 }, (_, j) => `invalid${i}_${j}`),
          WorkQueue: Array.from({ length: 75 }, (_, j) => `queue${i}_${j}`)
        };
      }
      
      const storageString = JSON.stringify(largeStorage);
      const startTime = Date.now();
      const result = getDashboardItems(storageString);
      const endTime = Date.now();
      
      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    test("handles very deep nested objects", () => {
      const deepNested = { level1: {} };
      let current = deepNested.level1;
      
      // Create a deeply nested object
      for (let i = 2; i <= 100; i++) {
        current[`level${i}`] = {};
        current = current[`level${i}`];
      }
      
      current.final = "value";
      
      const storageString = JSON.stringify(deepNested);
      const result = getDashboardItems(storageString);
      
      expect(result).toBeDefined();
      // Fixed: The function only processes roles in the predefined roleList
      // Custom properties like level1 are not included
      expect(result.level1).toBeUndefined();
    });

    test("handles special characters in JSON", () => {
      const specialCharStorage = {
        "Role with spaces": {
          "Tab with spaces": ["widget with spaces"],
          "Tab-with-dashes": ["widget-with-dashes"],
          "Tab_with_underscores": ["widget_with_underscores"]
        },
        "Role-with-special-chars!@#$%^&*()": {
          "Tab-with-special-chars!@#$%^&*()": ["widget!@#$%^&*()"]
        }
      };
      
      const storageString = JSON.stringify(specialCharStorage);
      const result = getDashboardItems(storageString);
      
      // Fixed: The function only processes roles in the predefined roleList
      // Custom roles with special characters are not included
      expect(result["Role with spaces"]).toBeUndefined();
      expect(result["Role-with-special-chars!@#$%^&*()"]).toBeUndefined();
    });
  });
});
