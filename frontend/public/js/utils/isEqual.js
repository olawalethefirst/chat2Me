export default function isEqual(value, other, visited = new WeakMap()) {
  // Handle primitives
  if (value === null || other === null || typeof value !== "object" || typeof other !== "object") {
    return Object.is(value, other);
  }
  
  // Handle circular references
  if (visited.has(value)) {
    return visited.get(value) === other;
  }
  visited.set(value, other);
  
  // Handle special types
  if (value instanceof Date && other instanceof Date) {
    return value.getTime() === other.getTime();
  }
  
  if (value instanceof RegExp && other instanceof RegExp) {
    return value.toString() === other.toString();
  }
  
  // Handle arrays
  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) {
      return false;
    }
    
    for (let i = 0; i < value.length; i++) {
      if (!isEqual(value[i], other[i], visited)) {
        return false;
      }
    }
    
    return true;
  }
  
  // Ensure same constructor
  if (value.constructor !== other.constructor) {
    return false;
  }
  
  // Handle objects
  const keys = Object.keys(value);
  if (keys.length !== Object.keys(other).length) {
    return false;
  }
  
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(other, key)) {
      return false;
    }
    
    if (!isEqual(value[key], other[key], visited)) {
      return false;
    }
  }
  
  return true;
}