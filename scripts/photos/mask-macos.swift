import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
let inPath = args[1], outPath = args[2]
guard let img = NSImage(contentsOfFile: inPath), let tiff = img.tiffRepresentation, let ci = CIImage(data: tiff) else { print("no image"); exit(1) }
let handler = VNImageRequestHandler(ciImage: ci, options: [:])
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let obs = req.results?.first else { print("no mask"); exit(2) }
let buf = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
let mask = CIImage(cvPixelBuffer: buf)
let ctx = CIContext()
guard let cg = ctx.createCGImage(mask, from: mask.extent) else { exit(3) }
let rep = NSBitmapImageRep(cgImage: cg)
try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: outPath))
print("ok")
